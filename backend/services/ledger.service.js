const { Gateway, Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");

/**
 * Get Hyperledger Fabric contract instance
 * @returns {Promise<Contract>} Fabric contract
 */
async function getContract() {
  const ccpPath = path.resolve(
    __dirname,
    "../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json"
  );

  const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

  const walletPath = path.join(__dirname, "../wallet");
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

/**
 * Record transaction to the ledger
 * @param {string} action - Action type (e.g., "CREATE_ACCOUNT")
 * @param {object} data - Transaction data
 * @returns {Promise<void>}
 */
async function recordTransaction(action, data) {
  const contract = await getContract();
  const timestamp = new Date().toISOString();
  const record = JSON.stringify({ action, data, timestamp });
  
  await contract.submitTransaction("CreateAsset", 
    `${action}_${Date.now()}`, 
    data.staffId || "system", 
    record
  );
}

module.exports = {
  getContract,
  recordTransaction,
};
