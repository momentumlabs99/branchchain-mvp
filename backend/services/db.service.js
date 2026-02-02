const nano = require("nano");
const config = require("../config/fabric.config");

// Initialize Nano with primary CouchDB URL
const couch = nano(config.couchdb.url);

// Initialize Nano with secondary CouchDB URL (for other organization)
const couch2 = nano(config.couchdb.url2);

// Reference to databases
const dbs = {
  accounts: couch.use(config.couchdb.databases.accounts),
  cards: couch.use(config.couchdb.databases.cards),
  customers: couch.use(config.couchdb.databases.customers),
};

/**
 * Initialize databases (create if not exist) on a specific CouchDB instance
 * @param {object} nanoInstance - Nano instance
 * @param {string} instanceLabel - Label for logging (e.g., "Org1" or "Org2")
 */
async function initDbsForInstance(nanoInstance, instanceLabel) {
  for (const dbName of Object.values(config.couchdb.databases)) {
    try {
      await nanoInstance.db.create(dbName);
      console.log(`Database '${dbName}' created on ${instanceLabel} CouchDB.`);
    } catch (err) {
      if (err.error !== "file_exists") {
        console.error(`Error creating database '${dbName}' on ${instanceLabel}:`, err.message);
      }
    }
  }
}

/**
 * Initialize databases on both CouchDB instances
 */
async function initDbs() {
  // Get instance labels based on port
  const getInstanceLabel = (url) => {
    if (url.includes(":5984")) return "Org1 (port 5984)";
    if (url.includes(":6984")) return "Org2 (port 6984)";
    return "Unknown";
  };

  console.log("Initializing databases on both CouchDB instances...");
  
  // Initialize on primary CouchDB
  await initDbsForInstance(couch, getInstanceLabel(config.couchdb.url));
  
  // Initialize on secondary CouchDB
  await initDbsForInstance(couch2, getInstanceLabel(config.couchdb.url2));
  
  console.log("Database initialization complete for both organizations.");
}

// Initialize databases on startup
initDbs().catch(console.error);

/**
 * Save document to collection
 * @param {string} collection - Collection name
 * @param {object} data - Data to save
 * @returns {Promise<object>} Saved document
 */
async function save(collection, data) {
  const db = dbs[collection];
  if (!db) throw new Error(`Invalid collection: ${collection}`);

  // Use 'id' as CouchDB '_id' for consistency if provided
  const doc = { ...data, _id: data.id || undefined };
  
  const response = await db.insert(doc);
  return { ...data, _rev: response.rev };
}

/**
 * Find document by ID
 * @param {string} collection - Collection name
 * @param {string} id - Document ID
 * @returns {Promise<object|null>} Found document or null
 */
async function findById(collection, id) {
  const db = dbs[collection];
  if (!db) throw new Error(`Invalid collection: ${collection}`);

  try {
    const doc = await db.get(id);
    // Map _id back to id for application compatibility
    const { _id, _rev, ...rest } = doc;
    return { id: _id, ...rest, _rev };
  } catch (err) {
    if (err.statusCode === 404) return null;
    throw err;
  }
}

/**
 * Update document
 * @param {string} collection - Collection name
 * @param {string} id - Document ID
 * @param {object} updates - Fields to update
 * @returns {Promise<object>} Updated document
 */
async function update(collection, id, updates) {
  const db = dbs[collection];
  if (!db) throw new Error(`Invalid collection: ${collection}`);

  const existing = await db.get(id);
  const updatedDoc = { ...existing, ...updates };
  
  const response = await db.insert(updatedDoc);
  return { ...updatedDoc, _rev: response.rev };
}

/**
 * Find all documents in collection
 * @param {string} collection - Collection name
 * @returns {Promise<array>} All documents
 */
async function findAll(collection) {
  const db = dbs[collection];
  if (!db) throw new Error(`Invalid collection: ${collection}`);

  const response = await db.list({ include_docs: true });
  return response.rows.map(row => {
    const { _id, _rev, ...rest } = row.doc;
    return { id: _id, ...rest, _rev };
  });
}

module.exports = {
  save,
  findById,
  update,
  findAll,
};
