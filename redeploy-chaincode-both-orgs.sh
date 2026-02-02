#!/bin/bash

# Script to redeploy branchchain chaincode to both org1 and org2 on channel test8
# This script uses the test-network environment setup scripts

set -e

echo "=== Redeploying branchchain chaincode to both org1 and org2 on channel test8 ==="

# Navigate to test-network
cd "$(dirname "$0")/fabric-samples/test-network"

# Source the environment variables script
. scripts/envVar.sh

# Set up PATH
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/../config/

echo ""
echo "Step 1: Removing old branchchain containers and volumes..."
# Stop and remove all branchchain containers
docker stop $(docker ps -q --filter "name=dev-peer.*branchchain") 2>/dev/null || true
docker rm $(docker ps -aq --filter "name=dev-peer.*branchchain") 2>/dev/null || true

# Remove the chaincode volumes to force a fresh deployment
docker volume prune -f

echo "Old containers and volumes removed"

echo ""
echo "Step 2: Creating fresh chaincode package..."
rm -f ../../chaincode/basic.tar.gz
peer lifecycle chaincode package ../../chaincode/basic.tar.gz \
  --path ../../chaincode/basic \
  --lang node \
  --label branchchain_1.0

echo "Chaincode package created"

echo ""
echo "Step 3: Querying installed chaincodes to get package ID..."
setGlobals 1
INSTALLED_OUTPUT=$(peer lifecycle chaincode queryinstalled)
echo "$INSTALLED_OUTPUT"

# Extract the package ID
PACKAGE_ID=$(echo "$INSTALLED_OUTPUT" | grep "Package ID: branchchain_1.0" | sed -n 's/Package ID: //; s/, Label.*//p' | head -1)

if [ -z "$PACKAGE_ID" ]; then
    echo "ERROR: Could not find branchchain_1.0 package ID"
    exit 1
fi

echo "Package ID: $PACKAGE_ID"

echo ""
echo "Step 6: Approving chaincode for org1 on test8..."
setGlobals 1
peer lifecycle chaincode approveformyorg \
  -o localhost:7050 \
  --channelID test8 \
  --name branchchain \
  --version 1.0 \
  --package-id $PACKAGE_ID \
  --sequence 2 \
  --tls \
  --cafile ${ORDERER_CA}

echo "Chaincode approved for org1"

echo ""
echo "Step 7: Approving chaincode for org2 on test8..."
setGlobals 2
peer lifecycle chaincode approveformyorg \
  -o localhost:7050 \
  --channelID test8 \
  --name branchchain \
  --version 1.0 \
  --package-id $PACKAGE_ID \
  --sequence 2 \
  --tls \
  --cafile ${ORDERER_CA}

echo "Chaincode approved for org2"

echo ""
echo "Step 8: Checking commit readiness..."
setGlobals 1
peer lifecycle chaincode checkcommitreadiness \
  --channelID test8 \
  --name branchchain \
  --version 1.0 \
  --sequence 2 \
  --tls \
  --cafile ${ORDERER_CA} \
  --output json

echo ""
echo "Step 9: Committing chaincode definition to test8..."
peer lifecycle chaincode commit \
  -o localhost:7050 \
  --channelID test8 \
  --name branchchain \
  --version 1.0 \
  --sequence 2 \
  --tls \
  --cafile ${ORDERER_CA} \
  --peerAddresses localhost:7051 \
  --tlsRootCertFiles ${PEER0_ORG1_CA} \
  --peerAddresses localhost:9051 \
  --tlsRootCertFiles ${PEER0_ORG2_CA}

echo "Chaincode definition committed to test8"

echo ""
echo "Step 10: Querying committed chaincode..."
peer lifecycle chaincode querycommitted \
  --channelID test8 \
  --name branchchain \
  --output json

echo ""
echo "Step 11: Waiting for chaincode containers to start (15 seconds)..."
sleep 15

echo ""
echo "Step 12: Checking chaincode containers..."
docker ps --filter "name=dev-peer.*branchchain" --format "table {{.Names}}\t{{.Status}}"

echo ""
echo "Step 13: Checking chaincode logs for errors..."
echo "--- Org1 Container ---"
ORG1_CONTAINER=$(docker ps --filter "name=dev-peer0.org1.*branchchain_1.0" --format "{{.Names}}" | head -1)
if [ -n "$ORG1_CONTAINER" ]; then
    echo "Container: $ORG1_CONTAINER"
    docker logs $ORG1_CONTAINER --tail 20
else
    echo "No org1 chaincode container found"
fi

echo ""
echo "--- Org2 Container ---"
ORG2_CONTAINER=$(docker ps --filter "name=dev-peer0.org2.*branchchain_1.0" --format "{{.Names}}" | head -1)
if [ -n "$ORG2_CONTAINER" ]; then
    echo "Container: $ORG2_CONTAINER"
    docker logs $ORG2_CONTAINER --tail 20
else
    echo "No org2 chaincode container found"
fi

echo ""
echo "=== Chaincode redeployment completed! ==="
echo ""
echo "Next steps:"
echo "1. Verify chaincode is running without errors (check logs above)"
echo "2. Your backend is configured for org2, so restart the server: cd backend && npm start"
echo "3. Test the login endpoint"
