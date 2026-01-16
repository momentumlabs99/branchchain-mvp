const path = require("path");

module.exports = {
  // Network configuration
  channelName: "mychannel",
  chaincodeName: "basic",
  
  // Organization identity
  mspId: "Org1MSP",
  
  // Peer configuration
  peerEndpoint: "localhost:7051",
  peerHostAlias: "peer0.org1.example.com",
  
  // Paths to crypto materials
  cryptoPath: path.resolve(
    __dirname,
    "../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com"
  ),
  
  // User crypto materials (User1 is created by default when network starts with -ca)
  userCertPath: path.resolve(
    __dirname,
    "../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts"
  ),
  userKeyPath: path.resolve(
    __dirname,
    "../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore"
  ),
  peerTlsCertPath: path.resolve(
    __dirname,
    "../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt"
  ),
};