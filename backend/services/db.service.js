const nano = require("nano");
const config = require("../config/fabric.config");

// Initialize Nano with CouchDB URL
const couch = nano(config.couchdb.url);

// Reference to databases
const dbs = {
  accounts: couch.use(config.couchdb.databases.accounts),
  cards: couch.use(config.couchdb.databases.cards),
  customers: couch.use(config.couchdb.databases.customers),
};

/**
 * Initialize databases (create if not exist)
 */
async function initDbs() {
  for (const dbName of Object.values(config.couchdb.databases)) {
    try {
      await couch.db.create(dbName);
      console.log(`Database '${dbName}' created.`);
    } catch (err) {
      if (err.error !== "file_exists") {
        console.error(`Error creating database '${dbName}':`, err.message);
      }
    }
  }
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
