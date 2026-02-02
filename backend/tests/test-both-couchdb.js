/**
 * Test script to verify connection to both CouchDB instances
 * Run this with: node test-both-couchdb.js
 */

const nano = require("nano");

// Configuration for both CouchDB instances
const couchdbConfig = {
  org1: "http://admin:adminpw@localhost:5984",
  org2: "http://admin:adminpw@localhost:6984",
};

const databases = ["accounts", "cards", "customers"];

async function testConnection(label, url) {
  console.log(`\n--- Testing connection to ${label} (${url}) ---`);
  
  try {
    const couch = nano(url);
    
    // Test basic connection
    const info = await couch.info();
    console.log(`✓ Connected to ${label}`);
    console.log(`  CouchDB version: ${info.version}`);
    console.log(`  Database name: ${info.db_name}`);
    
    // Check if our databases exist
    const dbList = await couch.db.list();
    console.log(`  Existing databases: ${dbList.length} total`);
    
    const ourDbs = dbList.filter(db => databases.includes(db));
    console.log(`  Our databases found: ${ourDbs.length} (${ourDbs.join(', ') || 'none'})`);
    
    // Try to create our databases if they don't exist
    for (const dbName of databases) {
      if (!dbList.includes(dbName)) {
        try {
          await couch.db.create(dbName);
          console.log(`  ✓ Created database '${dbName}' on ${label}`);
        } catch (err) {
          if (err.error !== "file_exists") {
            console.error(`  ✗ Error creating '${dbName}': ${err.message}`);
          }
        }
      } else {
        console.log(`  ✓ Database '${dbName}' already exists on ${label}`);
      }
    }
    
    return true;
  } catch (err) {
    console.error(`✗ Failed to connect to ${label}:`);
    console.error(`  Error: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log("=".repeat(60));
  console.log("Testing CouchDB Connections for Both Organizations");
  console.log("=".repeat(60));
  
  const results = {
    org1: await testConnection("Org1 CouchDB", couchdbConfig.org1),
    org2: await testConnection("Org2 CouchDB", couchdbConfig.org2),
  };
  
  console.log("\n" + "=".repeat(60));
  console.log("Summary:");
  console.log("=".repeat(60));
  console.log(`Org1 (port 5984): ${results.org1 ? "✓ Connected" : "✗ Failed"}`);
  console.log(`Org2 (port 6984): ${results.org2 ? "✓ Connected" : "✗ Failed"}`);
  
  if (results.org1 && results.org2) {
    console.log("\n✓ Both CouchDB instances are accessible!");
    console.log("You can now start the backend and it should create databases on both instances.");
  } else {
    console.log("\n✗ Some CouchDB instances are not accessible.");
    console.log("Please check:");
    console.log("  1. Are both CouchDB containers running? (docker ps | grep couchdb)");
    console.log("  2. Are the ports correct? (5984 for Org1, 6984 for Org2)");
    console.log("  3. Are the credentials correct? (admin/adminpw)");
  }
  
  console.log("\n" + "=".repeat(60));
}

main().catch(console.error);
