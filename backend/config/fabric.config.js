require("dotenv").config();
const path = require("path");

module.exports = {
  // CouchDB Configuration
  couchdb: {
    // Primary CouchDB URL (for the organization the backend is configured for)
    url: process.env.COUCHDB_URL || "http://admin:adminpw@localhost:5984",
    // Secondary CouchDB URL (for the other organization to ensure data replication)
    url2: process.env.COUCHDB_URL2 || "http://admin:adminpw@localhost:6984",
    databases: {
      accounts: "accounts",
      cards: "cards",
      customers: "customers",
    },
  },

  // Network configuration
  // Based on deployment in CHAINCODE_DEPLOYMENT_SOLUTION.md:
  // - Channel: test2
  // - Chaincode: branchchain (custom banking chaincode) or basic (asset transfer)
  // - Package ID: branchchain_1.0:ddc67f950a3353364d596b5bbd42700251001306a7bed343806e8be7d1c1ea94
  channelName: process.env.CHANNEL_NAME || "test3",
  chaincodeName: process.env.CHAINCODE_NAME || "branchchain",

  // Organization identity
  mspId: process.env.MSP_ID || "Org1MSP",

  // Paths to crypto materials
  cryptoPath: process.env.CRYPTO_PATH || path.resolve(__dirname, "../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com"),
  userCertPath: process.env.USER_CERT_PATH || path.resolve(__dirname, "../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts"),
  userKeyPath: process.env.USER_KEY_PATH || path.resolve(__dirname, "../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore"),
  peerTlsCertPath: process.env.PEER_TLS_CERT_PATH || path.resolve(__dirname, "../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt"),

  // Peer configuration
  peerEndpoint: process.env.PEER_ENDPOINT || "localhost:7051",
  peerHostAlias: process.env.PEER_HOST_ALIAS || "peer0.org1.example.com",
};
