
const { Gateway, Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");

async function getContract() {
  const ccpPath = path.resolve(
    __dirname,
    "../fabric/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json"
  );

  const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

  const walletPath = path.join(__dirname, "wallet");
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: "appUser",
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork("mychannel");
  return network.getContract("basic");
}

module.exports = getContract;