require("dotenv").config();

module.exports = {
  // CouchDB Configuration
  couchdb: {
    url: process.env.COUCHDB_URL || "http://admin:adminpw@localhost:5984",
    databases: {
      accounts: "accounts",
      cards: "cards",
      customers: "customers",
    },
  },

  // Network configuration
  channelName: process.env.CHANNEL_NAME || "mychannel",
  chaincodeName: process.env.CHAINCODE_NAME || "basic",

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
