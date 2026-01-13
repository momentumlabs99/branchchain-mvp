const path = require("path");

module.exports = {
  // Network configuration
  channelName: "mychannel",
  chaincodeName: "basic",
  
  // Connection profile path
  ccpPath: path.resolve(
    __dirname,
    "../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json"
  ),
  
  // Wallet configuration
  walletPath: path.join(__dirname, "../wallet"),
  
  // Identity
  identityName: "appUser",
  
  // Discovery settings
  discovery: {
    enabled: true,
    asLocalhost: true,
  },
};
