// Mock database storage
const storage = {
  accounts: [],
  cards: [],
  customers: [],
};

/**
 * Save document to collection
 * @param {string} collection - Collection name
 * @param {object} data - Data to save
 * @returns {Promise<object>} Saved document
 */
async function save(collection, data) {
  if (!storage[collection]) {
    storage[collection] = [];
  }
  
  storage[collection].push(data);
  return data;
}

/**
 * Find document by ID
 * @param {string} collection - Collection name
 * @param {string} id - Document ID
 * @returns {Promise<object|null>} Found document or null
 */
async function findById(collection, id) {
  if (!storage[collection]) {
    return null;
  }
  
  return storage[collection].find((doc) => doc.id === id) || null;
}

/**
 * Update document
 * @param {string} collection - Collection name
 * @param {string} id - Document ID
 * @param {object} updates - Fields to update
 * @returns {Promise<object>} Updated document
 */
async function update(collection, id, updates) {
  const doc = await findById(collection, id);
  
  if (!doc) {
    throw new Error("Document not found");
  }
  
  Object.assign(doc, updates);
  return doc;
}

/**
 * Find all documents in collection
 * @param {string} collection - Collection name
 * @returns {Promise<array>} All documents
 */
async function findAll(collection) {
  return storage[collection] || [];
}

module.exports = {
  save,
  findById,
  update,
  findAll,
};
