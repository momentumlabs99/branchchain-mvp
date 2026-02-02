#!/bin/bash

# Deploy branchchain 2.0 to channel test9 on org2 only

cd "$(dirname "$0")/fabric-samples/test-network"
. scripts/envVar.sh

echo "=== Deploying branchchain 2.0 to test9 on org2 ==="
echo ""

echo "Step 1: Approving chaincode for org2..."
setGlobals 2
peer lifecycle chaincode approveformyorg \
  -o localhost:7050 \
  --channelID test9 \
  --name branchchain \
  --version 2.0 \
  --package-id branchchain_2.0:cfa09f7dff49cec0aac313622d72b21fda41a25aef39ac1b07e4b9016203426a \
  --sequence 3 \
  --tls \
  --cafile ${ORDERER_CA}

echo "✓ Chaincode approved for org2"

echo ""
echo "Step 2: Checking commit readiness..."
peer lifecycle chaincode checkcommitreadiness \
  --channelID test9 \
  --name branchchain \
  --version 2.0 \
  --sequence 3 \
  --tls \
  --cafile ${ORDERER_CA} \
  --output json

echo ""
echo "Step 3: Committing chaincode definition..."
peer lifecycle chaincode commit \
  -o localhost:7050 \
  --channelID test9 \
  --name branchchain \
  --version 2.0 \
  --sequence 3 \
  --tls \
  --cafile ${ORDERER_CA} \
  --peerAddresses localhost:9051 \
  --tlsRootCertFiles ${PEER0_ORG2_CA}

echo "✓ Chaincode definition committed"

echo ""
echo "Step 4: Querying committed chaincode..."
peer lifecycle chaincode querycommitted \
  --channelID test9 \
  --name branchchain \
  --output json

echo ""
echo "Step 5: Waiting for chaincode container..."
sleep 10

echo ""
echo "Step 6: Checking chaincode containers..."
docker ps --filter "name=dev-peer.*branchchain" --format "table {{.Names}}\t{{.Status}}"

echo ""
echo "Step 7: Checking chaincode logs..."
CONTAINER=$(docker ps --filter "name=dev-peer0.org2.*branchchain_2.0" --format "{{.Names}}" | head -1)
if [ -n "$CONTAINER" ]; then
    echo "Container: $CONTAINER"
    docker logs $CONTAINER --tail 25
else
    echo "No chaincode container found yet - it will start on first transaction"
fi

echo ""
echo "=== Deployment completed! ==="
echo ""
echo "Next steps:"
echo "1. Update backend/.env: CHAINCODE_VERSION=2.0 (if needed)"
echo "2. Restart backend server"
echo "3. Test login endpoint"
