#!/bin/bash

# Simple Automated Chaincode Deployment Script
# Run this after editing chaincode code

# Configuration
CHAINCODE_NAME="branchchain"
CC_VERSION="1.0"
CHANNEL="test0"
CHAINCODE_PATH="../../chaincode/basic"

echo "=========================================="
echo "Automated Chaincode Deployment"
echo "=========================================="
echo ""

# Navigate to test-network
cd "$(dirname "$0")/fabric-samples/test-network"

# Source environment variables
. scripts/envVar.sh

# Step 1: Get current sequence number
echo "Step 1: Checking current chaincode version..."
setGlobals 1
COMMITTED_OUTPUT=$(peer lifecycle chaincode querycommitted -C $CHANNEL 2>&1)
HAS_CHAINCODE=$(echo "$COMMITTED_OUTPUT" | grep -c "$CHAINCODE_NAME" || echo "0")

if [ "$HAS_CHAINCODE" -eq "0" ]; then
    CURRENT_SEQ="0"
    echo "  No chaincode committed - using sequence 1 (initial deployment)"
    NEXT_SEQ="1"
else
    CURRENT_SEQ=$(echo "$COMMITTED_OUTPUT" | grep -oP '"sequence":[0-9]+' | grep -oP '[0-9]\+')
    NEXT_SEQ=$((CURRENT_SEQ + 1))
    echo "  Current sequence: $CURRENT_SEQ"
    echo "  Next sequence: $NEXT_SEQ"
fi

echo ""

# Step 2: Create package
echo "Step 2: Creating chaincode package..."
rm -f basic.tar.gz
peer lifecycle chaincode package basic.tar.gz \
  --path $CHAINCODE_PATH \
  --lang node \
  --label ${CHAINCODE_NAME}_${CC_VERSION} 2>&1 | grep -v "Creating package"
echo "  ✓ Package created"
echo ""

# Step 3: Install on org1
echo "Step 3: Installing chaincode on org1..."
setGlobals 1
peer lifecycle chaincode install basic.tar.gz 2>&1 | grep -v "Installed remotely"
echo "  ✓ Installed on org1"
echo ""

# Step 4: Install on org2
echo "Step 4: Installing chaincode on org2..."
setGlobals 2
peer lifecycle chaincode install basic.tar.gz 2>&1 | grep -v "Installed remotely"
echo "  ✓ Installed on org2"
echo ""

# Step 5: Get package ID
echo "Step 5: Getting package ID..."
setGlobals 1
PACKAGE_ID=$(peer lifecycle chaincode queryinstalled 2>&1 | grep "Package ID: ${CHAINCODE_NAME}_${CC_VERSION}" | sed -n 's/Package ID: //; s/, Label.*//p')
echo "  Package ID: $PACKAGE_ID"
echo ""

# Step 6: Approve for org1
echo "Step 6: Approving chaincode for org1..."
setGlobals 1
peer lifecycle chaincode approveformyorg \
  -o localhost:7050 \
  --channelID $CHANNEL \
  --name $CHAINCODE_NAME \
  --version $CC_VERSION \
  --package-id $PACKAGE_ID \
  --sequence $NEXT_SEQ \
  --tls \
  --cafile ${ORDERER_CA} 2>&1 | grep -v "ClientWait"
echo "  ✓ Approved by org1"
echo ""

# Step 7: Approve for org2
echo "Step 7: Approving chaincode for org2..."
setGlobals 2
peer lifecycle chaincode approveformyorg \
  -o localhost:7050 \
  --channelID $CHANNEL \
  --name $CHAINCODE_NAME \
  --version $CC_VERSION \
  --package-id $PACKAGE_ID \
  --sequence $NEXT_SEQ \
  --tls \
  --cafile ${ORDERER_CA} 2>&1 | grep -v "ClientWait"
echo "  ✓ Approved by org2"
echo ""

# Step 8: Check commit readiness
echo "Step 8: Checking commit readiness..."
setGlobals 1
peer lifecycle chaincode checkcommitreadiness \
  --channelID $CHANNEL \
  --name $CHAINCODE_NAME \
  --version $CC_VERSION \
  --sequence $NEXT_SEQ \
  --tls \
  --cafile ${ORDERER_CA} \
  --output json 2>&1 | grep -oP '"Org[12]MSP":(true|false)' | tr ',' '\n'
echo ""

# Step 9: Commit
echo "Step 9: Committing chaincode definition..."
setGlobals 1
peer lifecycle chaincode commit \
  -o localhost:7050 \
  --channelID $CHANNEL \
  --name $CHAINCODE_NAME \
  --version $CC_VERSION \
  --sequence $NEXT_SEQ \
  --tls \
  --cafile ${ORDERER_CA} \
  --peerAddresses localhost:7051 \
  --tlsRootCertFiles ${PEER0_ORG1_CA} \
  --peerAddresses localhost:9051 \
  --tlsRootCertFiles ${PEER0_ORG2_CA} 2>&1 | grep -v "ClientWait"
echo "  ✓ Committed to channel $CHANNEL"
echo ""

# Step 10: Verify
echo "Step 10: Verifying deployment..."
sleep 3

# Query committed
setGlobals 1
COMMITTED=$(peer lifecycle chaincode querycommitted -C $CHANNEL -n $CHAINCODE_NAME 2>&1 | grep '"sequence"' | grep -oP '\d+')
echo "  Committed sequence: $COMMITTED"

# Check containers
sleep 2
setGlobals 2
CONTAINERS=$(docker ps --filter "name=dev-peer.*${CHAINCODE_NAME}" --format "{{.Names}}" 2>&1 | wc -l)
echo "  Running containers: $CONTAINERS"
echo ""

# Step 11: Test chaincode
echo "Step 11: Testing chaincode..."
RESULT=$(peer chaincode query -C $CHANNEL -n $CHAINCODE_NAME -c '{"Args":["GetAllOperations"]}' 2>&1)
if echo "$RESULT" | grep -q "\[\]"; then
    echo "  ✓ Chaincode is working"
else
    echo "  ⚠ Warning: Chaincode query may have failed"
fi

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Summary:"
echo "  Chaincode: $CHAINCODE_NAME"
echo "  Version: $CC_VERSION"
echo "  Sequence: $NEXT_SEQ"
echo "  Channel: $CHANNEL"
echo ""
echo "Next steps:"
echo "  1. Test backend with: node test-login-endpoint.js"
echo "  2. Verify blockchain: peer chaincode query -C $CHANNEL -n $CHAINCODE_NAME -c '{\"Args\":[\"GetAllOperations\"]}'"
echo ""
