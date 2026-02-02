#!/bin/bash

# Complete network restart with clean slate
# This script restarts Fabric network and deploys fresh chaincode with fixed source code

set -e

echo "=========================================="
echo "Complete Fabric Network Restart"
echo "=========================================="
echo ""

# Navigate to test-network
cd "$(dirname "$0")/fabric-samples/test-network"

# Step 1: Stop network
echo "Step 1: Stopping Fabric network..."
./network.sh down
echo "✓ Network stopped"
echo ""

# Step 2: Clean up Docker volumes
echo "Step 2: Cleaning up Docker volumes..."
docker volume prune -f
echo "✓ Docker volumes cleaned"
echo ""

# Step 3: Start network with test8 channel
echo "Step 3: Starting network with test8 channel..."
./network.sh up createChannel -c test8
echo "✓ Network started with test8 channel"
echo ""

# Step 4: Deploy chaincode to test8
echo "Step 4: Deploying branchchain chaincode to test8..."
./network.sh deployCC -ccn branchchain -ccp ../../chaincode/basic -ccl javascript -c test8
echo "✓ Chaincode deployed"
echo ""

# Step 5: Verify deployment
echo "Step 5: Verifying chaincode deployment..."
sleep 5
echo ""
echo "Running chaincode containers:"
docker ps --filter "name=dev-peer.*branchchain" --format "table {{.Names}}\t{{.Status}}"
echo ""

# Step 6: Check chaincode logs
echo "Step 6: Checking chaincode logs for errors..."
echo "--- Org1 Container ---"
ORG1_CONTAINER=$(docker ps --filter "name=dev-peer0.org1.*branchchain_1.0" --format "{{.Names}}" | head -1)
if [ -n "$ORG1_CONTAINER" ]; then
    echo "Container: $ORG1_CONTAINER"
    docker logs $ORG1_CONTAINER --tail 25 | grep -i "error\|ready\|established\|Registering"
else
    echo "No org1 chaincode container"
fi

echo ""
echo "--- Org2 Container ---"
ORG2_CONTAINER=$(docker ps --filter "name=dev-peer0.org2.*branchchain_1.0" --format "{{.Names}}" | head -1)
if [ -n "$ORG2_CONTAINER" ]; then
    echo "Container: $ORG2_CONTAINER"
    docker logs $ORG2_CONTAINER --tail 25 | grep -i "error\|ready\|established\|Registering"
else
    echo "No org2 chaincode container"
fi

echo ""
echo "=========================================="
echo "Network restart completed successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Wait a few seconds for chaincode containers to fully initialize"
echo "2. Restart your backend server:"
echo "   cd /home/ham/fabric-projects/branchchain-mvp/backend && npm start"
echo "3. Test the login endpoint with your credentials"
echo ""
