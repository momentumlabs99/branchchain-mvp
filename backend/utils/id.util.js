/**
 * Generate unique ID with prefix
 * @param {string} prefix - ID prefix
 * @returns {string} Unique ID
 */
function generateId(prefix) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}${timestamp}${random}`;
}

module.exports = { generateId };
