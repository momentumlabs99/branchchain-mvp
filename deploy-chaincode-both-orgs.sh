#!/bin/bash

# Script to deploy branchchain chaincode to both org1 and org2 peers on channel test8

set -e

echo "=== Deploying branchchain chaincode to both org1 and org2 on channel test8 ==="

# Navigate to test-network
cd "$(dirname "$0")/fabric-samples/test-network"

# Step 1: Stop and clean up any existing chaincode containers and volumes
echo "Step 1: Cleaning up existing chaincode containers and volumes..."
docker stop $(docker ps -q --filter "name=dev-peer.*branchchain") 2>/dev/null || true
docker rm $(docker ps -aq --filter "name=dev-peer.*branchchain") 2>/dev/null || true
docker volume prune -f

# Step 2: Verify test8 channel exists
echo "Step 2: Verifying test8 channel exists..."
export FABRIC_CFG_PATH=$PWD/../config/
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=$PWD/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=peer0.org1.example.com:7051

docker exec peer0.org1.example.com peer channel list 2>&1 | grep test8 || echo "Warning: test8 channel not found"

# Step 3: Create chaincode package
echo "Step 3: Creating chaincode package..."
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
peer lifecycle chaincode package ../../chaincode/basic.tar.gz \
  --path ../../chaincode/basic \
  --lang node \
  --label branchchain_1.0

# Step 4: Install on org1
echo "Step 4: Installing chaincode on org1..."
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=$PWD/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=peer0.org1.example.com:7051

peer lifecycle chaincode install ../../chaincode/basic.tar.gz

# Step 5: Install on org2
echo "Step 5: Installing chaincode on org2..."
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=$PWD/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=peer0.org2.example.com:9051

peer lifecycle chaincode install ../../chaincode/basic.tar.gz

# Step 6: Query installed on org1 to get package ID
echo "Step 6: Querying installed chaincodes on org1..."
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=$PWD/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=peer0.org1.example.com:7051

PACKAGE_ID=$(peer lifecycle chaincode queryinstalled | grep "Package ID: branchchain_1.0" | sed -n 's/Package ID: //; s/, Label.*//p')
echo "Package ID: $PACKAGE_ID"

# Step 7: Approve for org1
echo "Step 7: Approving chaincode for org1 on test8..."
peer lifecycle chaincode approveformyorg \
  -o orderer.example.com:7050 \
  --channelID test8 \
  --name branchchain \
  --version 1.0 \
  --package-id $PACKAGE_ID \
  --sequence 1 \
  --tls \
  --cafile $PWD/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

# Step 8: Approve for org2
echo "Step 8: Approving chaincode for org2 on test8..."
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=$PWD/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=peer0.org2.example.com:9051

peer lifecycle chaincode approveformyorg \
  -o orderer.example.com:7050 \
  --channelID test8 \
  --name branchchain \
  --version 1.0 \
  --package-id $PACKAGE_ID \
  --sequence 1 \
  --tls \
  --cafile $PWD/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

# Step 9: Check commit readiness
echo "Step 9: Checking commit readiness..."
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=$PWD/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=peer0.org1.example.com:7051

peer lifecycle chaincode checkcommitreadiness \
  --channelID test8 \
  --name branchchain \
  --version 1.0 \
  --sequence 1 \
  --tls \
  --cafile $PWD/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
  --output json

# Step 10: Commit the chaincode definition
echo "Step 10: Committing chaincode definition to test8..."
peer lifecycle chaincode commit \
  -o orderer.example.com:7050 \
  --channelID test8 \
  --name branchchain \
  --version 1.0 \
  --sequence 1 \
  --tls \
  --cafile $PWD/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
  --peerAddresses peer0.org1.example.com:7051 \
  --tlsRootCertFiles $PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
  --peerAddresses peer0.org2.example.com:9051 \
  --tlsRootCertFiles $PWD/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt

# Step 11: Query committed chaincode
echo "Step 11: Querying committed chaincode..."
peer lifecycle chaincode querycommitted \
  --channelID test8 \
  --name branchchain \
  --output json

echo ""
echo "=== Chaincode deployment completed successfully! ==="
echo ""
echo "Next steps:"
echo "1. Check that chaincode containers are running: docker ps --filter 'name=dev-peer.*branchchain'"
echo "2. Verify chaincode logs: docker logs dev-peer0.org1.example.com-branchchain_1.0-* --tail 20"
echo "3. Test the backend login endpoint"
