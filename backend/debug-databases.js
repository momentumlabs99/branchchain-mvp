const nano = require("nano");

// Test database connections
const testDbConnection = (url, name) => {
  console.log(`\n=== Testing ${name} (${url}) ===`);
  try {
    const couch = nano(url);
    
    // Check if databases exist
    couch.db.get("_all_dbs").then(dbs => {
      console.log("Available databases:", dbs);
      
      // Check specific application databases
      const appDbs = ["accounts", "customers", "cards"];
      appDbs.forEach(dbName => {
        couch.db.get(dbName).then(info => {
          console.log(`${dbName} database exists:`, info);
          // Get documents count
          couch.use(dbName).list({ include_docs: true }).then(result => {
            console.log(`${dbName} documents count:`, result.rows.length);
            if (result.rows.length > 0) {
              console.log(`${dbName} sample documents:`, result.rows.slice(0, 2));
            }
          }).catch(err => {
            console.log(`${dbName} documents list error:`, err.message);
          });
        }).catch(err => {
          console.log(`${dbName} database not found:`, err.message);
        });
      });
    }).catch(err => {
      console.log("Error getting databases:", err.message);
    });
  } catch (err) {
    console.log("Connection error:", err.message);
  }
};

// Test both CouchDB instances
testDbConnection("http://admin:adminpw@localhost:5984", "Primary CouchDB (Org1)");
testDbConnection("http://admin:adminpw@localhost:6984", "Secondary CouchDB (Org2)");