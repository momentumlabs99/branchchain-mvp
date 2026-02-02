#!/bin/bash

# Script to redeploy branchchain chaincode to org2 on channel test8
# This script uses the test-network environment setup scripts

set -e

echo "=== Redeploying branchchain chaincode to org2 on channel test8 ==="

# Navigate to test-network
cd "$(dirname "$0")/fabric-samples/test-network"

# Source the environment variables script
. scripts/envVar.sh

# Set up PATH
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/../config/

echo ""
echo "Step 1: Setting up environment for Org2..."
setGlobals 2

echo "Environment set for Org2"
echo "  CORE_PEER_LOCALMSPID: $CORE_PEER_LOCALMSPID"
echo "  CORE_PEER_ADDRESS: $CORE_PEER_ADDRESS"

echo ""
echo "Step 2: Removing old branchchain containers and volumes..."
# Stop and remove all branchchain containers
docker stop $(docker ps -q --filter "name=dev-peer.*branchchain") 2>/dev/null || true
docker rm $(docker ps -aq --filter "name=dev-peer.*branchchain") 2>/dev/null || true

# Remove the chaincode volumes to force a fresh deployment
docker volume prune -f

echo "Old containers and volumes removed"

echo ""
echo "Step 3: Creating fresh chaincode package..."
rm -f ../../chaincode/basic.tar.gz
peer lifecycle chaincode package ../../chaincode/basic.tar.gz \
  --path ../../chaincode/basic \
  --lang node \
  --label branchchain_1.0

echo "Chaincode package created"

echo ""
echo "Step 4: Querying installed chaincodes to get package ID..."
INSTALLED_OUTPUT=$(peer lifecycle chaincode queryinstalled)
echo "$INSTALLED_OUTPUT"

# Extract the package ID
PACKAGE_ID=$(echo "$INSTALLED_OUTPUT" | grep "Package ID: branchchain_1.0" | sed -n 's/Package ID: //; s/, Label.*//p')

if [ -z "$PACKAGE_ID" ]; then
    echo "ERROR: Could not find branchchain_1.0 package ID"
    exit 1
fi

echo "Package ID: $PACKAGE_ID"

echo ""
echo "Step 6: Approving chaincode for org2 on test8..."
peer lifecycle chaincode approveformyorg \
  -o localhost:7050 \
  --channelID test8 \
  --name branchchain \
  --version 1.0 \
  --package-id $PACKAGE_ID \
  --sequence 1 \
  --tls \
  --cafile ${ORDERER_CA}

echo "Chaincode approved for org2"

echo ""
echo "Step 7: Checking commit readiness..."
peer lifecycle chaincode checkcommitreadiness \
  --channelID test8 \
  --name branchchain \
  --version 1.0 \
  --sequence 1 \
  --tls \
  --cafile ${ORDERER_CA} \
  --output json

echo ""
echo "Step 8: Committing chaincode definition to test8..."
peer lifecycle chaincode commit \
  -o localhost:7050 \
  --channelID test8 \
  --name branchchain \
  --version 1.0 \
  --sequence 1 \
  --tls \
  --cafile ${ORDERER_CA} \
  --peerAddresses localhost:9051 \
  --tlsRootCertFiles ${PEER0_ORG2_CA}

echo "Chaincode definition committed to test8"

echo ""
echo "Step 9: Querying committed chaincode..."
peer lifecycle chaincode querycommitted \
  --channelID test8 \
  --name branchchain \
  --output json

echo ""
echo "Step 10: Waiting for chaincode container to start (15 seconds)..."
sleep 15

echo ""
echo "Step 11: Checking chaincode containers..."
docker ps --filter "name=dev-peer.*branchchain" --format "table {{.Names}}\t{{.Status}}"

echo ""
echo "Step 12: Checking chaincode logs for errors..."
NEW_CONTAINER=$(docker ps --filter "name=dev-peer0.org2.*branchchain_1.0" --format "{{.Names}}" | head -1)
if [ -n "$NEW_CONTAINER" ]; then
    echo "Container: $NEW_CONTAINER"
    echo "Logs:"
    docker logs $NEW_CONTAINER --tail 30
else
    echo "No chaincode container found"
fi

echo ""
echo "=== Chaincode redeployment completed! ==="
echo ""
echo "Next steps:"
echo "1. Verify chaincode is running without errors (check logs above)"
echo "2. Restart your backend server: cd backend && npm start"
echo "3. Test the login endpoint"
