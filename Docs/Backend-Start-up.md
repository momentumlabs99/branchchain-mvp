# Backend Startup Guide - BranchChain MVP
# Using Fabric Gateway API (v2.0.0)

# ========================================
# Step 1: Start Fabric Network with CA
# ========================================
cd /home/ham/Documents/PROJECTS/Momentum\ Labs/branchchain-mvp/fabric-samples/test-network

# Start network with Certificate Authorities
# This creates User1 identity automatically
./network.sh up createChannel -ca

# Verify network is running
docker ps

# You should see 7 containers:
# - peer0.org1.example.com
# - peer0.org2.example.com
# - orderer.example.com
# - ca_org1
# - ca_org2
# - couchdb0.org1.example.com
# - couchdb0.org2.example.com

# ========================================
# Step 2: Deploy Chaincode
# ========================================

# Deploy the basic chaincode to the channel
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go -ccl go

# Verify chaincode deployment
docker logs peer0.org1.example.com | grep -i "basic"

# ========================================
# Step 3: Verify User1 Identity Exists
# ========================================

# User1 is created automatically when network starts with -ca flag
# Gateway API uses this identity directly (no wallet needed)

cd /home/ham/Documents/PROJECTS/Momentum\ Labs/branchchain-mvp

# Verify User1 identity exists
ls -la fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/

# You should see:
# msp/
#   signcerts/ (contains User1 certificate)
#   keystore/ (contains User1 private key)

# ========================================
# Step 4: Install Backend Dependencies
# ========================================

cd backend

# Install all dependencies including new Gateway API packages
npm install

# Verify installation
npm list @hyperledger/fabric-gateway @grpc/grpc-js

# ========================================
# Step 5: Start Backend Server
# ========================================

# Development mode with auto-reload
npm run dev

# OR Production mode
npm start

# Expected output:
# 🚀 BranchChain API running on http://localhost:4000

# ========================================
# Step 6: Verify Backend is Working
# ========================================

# Test health check endpoint
curl http://localhost:4000/health

# Expected response:
# {"status":"ok","service":"BranchChain API"}

# Test root endpoint
curl http://localhost:4000/api

# ========================================
# Step 7: Test API Endpoints
# ========================================

# Create a test account
curl -X POST http://localhost:4000/api/accounts/create \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "TEST001",
    "accountType": "SAVINGS",
    "initialDeposit": 1000,
    "staffId": "STAFF001",
    "branchId": "BRANCH001"
  }'

# Get all audit logs
curl http://localhost:4000/api/audit

# Get specific transaction (replace with actual transaction ID)
curl http://localhost:4000/api/audit/CREATE_ACCOUNT_1234567890123

# ========================================
# Step 8: Verify Ledger Integration
# ========================================

cd /home/ham/Documents/PROJECTS/Momentum\ Labs/branchchain-mvp/fabric-samples/test-network

# Set environment for Org1
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

# Query all assets from ledger
peer chaincode query \
  -C mychannel \
  -n basic \
  -c '{"Args":["GetAllAssets"]}'

# ========================================
# Stopping the Application
# ========================================

# Stop backend (Press Ctrl+C in terminal where backend is running)

# Stop Fabric network
cd /home/ham/Documents/PROJECTS/Momentum\ Labs/branchchain-mvp/fabric-samples/test-network
./network.sh down

# ========================================
# Troubleshooting
# ========================================

# Issue: "Cannot find module '@hyperledger/fabric-gateway'"
# Solution: cd backend && npm install

# Issue: "No files in directory: keystore"
# Solution: Restart network with -ca flag
# cd fabric-samples/test-network
# ./network.sh down
# ./network.sh up createChannel -ca

# Issue: "Connection refused"
# Solution: Check if Fabric network is running
# docker ps

# Issue: "Chaincode not found"
# Solution: Redeploy chaincode
# cd fabric-samples/test-network
# ./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go -ccl go

# ========================================
# Quick Reference
# ========================================

# Start everything:
cd /home/ham/Documents/PROJECTS/Momentum\ Labs/branchchain-mvp/fabric-samples/test-network && ./network.sh up createChannel -ca && ./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go -ccl go && cd ../../backend && npm install && npm start

# Stop everything:
# Ctrl+C (backend)
# cd /home/ham/Documents/PROJECTS/Momentum\ Labs/branchchain-mvp/fabric-samples/test-network && ./network.sh down