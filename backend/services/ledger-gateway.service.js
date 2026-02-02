const grpc = require('@grpc/grpc-js');
const { connect, signers } = require('@hyperledger/fabric-gateway');
const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const { TextDecoder } = require('util');

// Import configuration
const config = require('../config/fabric.config');

const utf8Decoder = new TextDecoder();

/**
 * Create gRPC connection to Fabric peer
 * @returns {Promise<Client>} gRPC client
 */
async function newGrpcConnection() {
  // Load peer TLS certificate
  const tlsCertPath = config.peerTlsCertPath;
  
  const tlsRootCert = await fs.readFile(tlsCertPath);
  const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
  
  return new grpc.Client(
    config.peerEndpoint,
    tlsCredentials,
    {
      'grpc.ssl_target_name_override': config.peerHostAlias,
      'grpc.default_authority': config.peerHostAlias,
    }
  );
}

/**
 * Load user identity from crypto materials
 * @returns {Promise<object>} Identity object with MSP ID and credentials
 */
async function newIdentity() {
  // Load user certificate
  const certDirectoryPath = config.userCertPath;
  
  const files = await fs.readdir(certDirectoryPath);
  const certPath = path.join(certDirectoryPath, files[0]);
  const credentials = await fs.readFile(certPath);
  
  return {
    mspId: config.mspId,
    credentials,
  };
}

/**
 * Create signer from private key
 * @returns {Promise<Signer>} Signer for transaction signing
 */
async function newSigner() {
  // Load private key
  const keyDirectoryPath = config.userKeyPath;
  
  const files = await fs.readdir(keyDirectoryPath);
  const keyPath = path.join(keyDirectoryPath, files[0]);
  const privateKeyPem = await fs.readFile(keyPath);
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  
  return signers.newPrivateKeySigner(privateKey);
}

/**
 * Get contract instance from Fabric network
 * @returns {Promise<Contract>} Fabric contract
 */
async function getContract() {
  const client = await newGrpcConnection();
  
  const gateway = connect({
    client,
    identity: await newIdentity(),
    signer: await newSigner(),
    // Default timeouts for different operations
    evaluateOptions: () => ({ deadline: Date.now() + 5000 }),   // 5 seconds for queries
    endorseOptions: () => ({ deadline: Date.now() + 15000 }),  // 15 seconds for endorsement
    submitOptions: () => ({ deadline: Date.now() + 5000 }),     // 5 seconds for submission
    commitStatusOptions: () => ({ deadline: Date.now() + 60000 }), // 1 minute for commit
  });

  // Get network and contract
  const network = gateway.getNetwork(config.channelName);
  const contract = network.getContract(config.chaincodeName);

  // Store gateway and client for cleanup
  contract._gateway = gateway;
  contract._client = client;

  return contract;
}

/**
 * Record transaction to ledger (write operation)
 * @param {string} action - Action type (e.g., "CREATE_ACCOUNT")
 * @param {object} data - Transaction data
 * @returns {Promise<string>} Transaction ID
 */
async function recordTransaction(action, data) {
  const contract = await getContract();
  
  try {
    const timestamp = new Date().toISOString();
    const assetId = `${action}_${Date.now()}`;
    
    console.log(`--> Submit Transaction: CreateAsset for ${assetId}`);
    
    // Submit transaction to chaincode
    await contract.submitTransaction(
      'RecordOperation',
      action,
      JSON.stringify(data)
    );

    console.log(`*** Transaction committed successfully: ${assetId}`);
    return assetId;

  } finally {
    // Always cleanup connections
    if (contract._gateway) {
      contract._gateway.close();
    }
    if (contract._client) {
      contract._client.close();
    }
  }
}

/**
 * Query all transactions from ledger (read-only operation)
 * @returns {Promise<Array>} Array of all transactions
 */
async function queryTransactions() {
  const contract = await getContract();
  
  try {
    console.log('--> Evaluate Transaction: GetAllOperations');
    const resultBytes = await contract.evaluateTransaction('GetAllOperations');
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    
    console.log(`*** Result: ${result.length} operations found`);
    return result;

  } finally {
    // Always cleanup connections
    if (contract._gateway) {
      contract._gateway.close();
    }
    if (contract._client) {
      contract._client.close();
    }
  }
}

/**
 * Query single transaction by ID (read-only operation)
 * @param {string} assetId - Asset/Transaction ID
 * @returns {Promise<object>} Transaction details
 */
async function queryTransactionById(txId) {
  const contract = await getContract();
  
  try {
    console.log(`--> Evaluate Transaction: QueryOperation for ${txId}`);
    const resultBytes = await contract.evaluateTransaction('QueryOperation', txId);
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    
    console.log(`*** Result:`, result);
    return result;

  } finally {
    // Always cleanup connections
    if (contract._gateway) {
      contract._gateway.close();
    }
    if (contract._client) {
      contract._client.close();
    }
  }
}

// Note: Update functionality not supported by the current chaincode design
// All operations are recorded as immutable transactions on the ledger

module.exports = {
  recordTransaction,
  queryTransactions,
  queryTransactionById,
  // Note: Update functionality not supported - all operations are immutable on the ledger
};
