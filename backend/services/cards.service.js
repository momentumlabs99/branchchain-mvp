const Card = require("../models/Card");
const dbService = require("./db.service");
const accountsService = require("./accounts.service");

/**
 * Create new card
 * @param {object} data - Card data
 * @returns {Promise<object>} Created card
 */
async function createCard(data) {
  const card = new Card(data);
  const saved = await dbService.save("cards", card);
  return saved;
}

/**
 * Get card by ID
 * @param {string} cardId - Card ID
 * @returns {Promise<object|null>} Card or null
 */
async function getCardById(cardId) {
  const card = await dbService.findById("cards", cardId);
  return card;
}

/**
 * Get card by card number
 * @param {string} cardNumber - Card number
 * @returns {Promise<object|null>} Card or null
 */
async function getCardByCardNumber(cardNumber) {
  const cards = await dbService.findAll("cards");
  const card = cards.find(c => c.cardNumber === cardNumber);
  return card || null;
}

/**
 * Get card by card serial
 * @param {string} cardSerial - Card serial
 * @returns {Promise<object|null>} Card or null
 */
async function getCardByCardSerial(cardSerial) {
  const cards = await dbService.findAll("cards");
  const card = cards.find(c => c.cardSerial === cardSerial);
  return card || null;
}

/**
 * Get all cards for an account
 * @param {string} accountId - Account ID
 * @returns {Promise<array>} Array of cards
 */
async function getCardsByAccountId(accountId) {
  const cards = await dbService.findAll("cards");
  return cards.filter(card => card.accountId === accountId);
}

/**
 * Update card status
 * @param {string} cardId - Card ID
 * @param {string} status - New status
 * @returns {Promise<object>} Updated card
 */
async function updateCardStatus(cardId, status) {
  return dbService.update("cards", cardId, { 
    status,
    updatedAt: new Date().toISOString()
  });
}

/**
 * Replace card (deactivate old, activate new)
 * @param {string} oldCardNumber - Old card number
 * @param {string} newCardSerial - New card serial
 * @param {string} reason - Replacement reason
 * @param {string} staffId - Staff ID
 * @param {string} branchId - Branch ID
 * @returns {Promise<object>} Replacement result
 */
async function replaceCard(oldCardNumber, newCardSerial, reason, staffId, branchId) {
  // Find the old card
  const oldCard = await getCardByCardNumber(oldCardNumber);
  if (!oldCard) {
    throw new Error("Old card not found");
  }

  // Find the new card by serial
  const newCard = await getCardByCardSerial(newCardSerial);
  if (!newCard) {
    throw new Error("New card not found");
  }

  // Ensure cards belong to the same account
  if (oldCard.accountId !== newCard.accountId) {
    throw new Error("Cards must belong to the same account");
  }

  // Deactivate old card
  await updateCardStatus(oldCard.id, "INACTIVE");

  // Activate new card
  await updateCardStatus(newCard.id, "ACTIVE");

  return {
    oldCard,
    newCard,
    reason,
    staffId,
    branchId,
    replacedAt: new Date().toISOString()
  };
}

module.exports = {
  createCard,
  getCardById,
  getCardByCardNumber,
  getCardByCardSerial,
  getCardsByAccountId,
  updateCardStatus,
  replaceCard,
};