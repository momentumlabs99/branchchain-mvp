const axios = require('axios');
require('dotenv').config({ path: './backend/.env' });

const API_URL = 'http://localhost:5000/api';
let authToken = '';

/**
 * Login as staff to get token
 */
async function login() {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username: 'staff1', // Assuming this exists from setup
      password: 'password123'
    });
    authToken = response.data.data.token;
    console.log('Logged in successfully');
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

/**
 * Create accounts in different "Orgs" (simulated by branch IDs)
 */
async function setupTestAccounts() {
  try {
    console.log('Setting up test accounts...');
    
    // Account 1 (Org 1 context)
    const acc1 = await axios.post(`${API_URL}/accounts/create`, {
      customerId: 'CUST-ORG1-001',
      accountType: 'SAVINGS',
      initialDeposit: 1000,
      staffId: 'STAFF1',
      branchId: 'BRANCH-ORG1'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('Account 1 Created:', acc1.data.data.account.id);

    // Account 2 (Org 2 context)
    const acc2 = await axios.post(`${API_URL}/accounts/create`, {
      customerId: 'CUST-ORG2-001',
      accountType: 'SAVINGS',
      initialDeposit: 500,
      staffId: 'STAFF2',
      branchId: 'BRANCH-ORG2'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('Account 2 Created:', acc2.data.data.account.id);

    return {
      acc1Id: acc1.data.data.account.id,
      acc2Id: acc2.data.data.account.id
    };
  } catch (error) {
    console.error('Setup failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

/**
 * Test Transfer Funds
 */
async function testTransfer(fromId, toId) {
  try {
    console.log(`Transferring 200 from ${fromId} to ${toId}...`);
    const response = await axios.post(`${API_URL}/accounts/transfer`, {
      fromAccountId: fromId,
      toAccountId: toId,
      amount: 200,
      staffId: 'STAFF-SYSTEM',
      branchId: 'SYSTEM-GATEWAY'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    console.log('Transfer Result:', JSON.stringify(response.data.data, null, 2));
    console.log('Ledger Transaction ID:', response.data.data.transactionId);
  } catch (error) {
    console.error('Transfer failed:', error.response?.data || error.message);
  }
}

async function runTest() {
  await login();
  const { acc1Id, acc2Id } = await setupTestAccounts();
  await testTransfer(acc1Id, acc2Id);
}

runTest();
