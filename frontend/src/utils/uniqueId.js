// Utility for generating unique IDs to prevent React key duplicates
let idCounter = 0;

/**
 * Generates a unique ID using timestamp, counter, and random string
 * This ensures uniqueness even when called in rapid succession
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Unique ID
 */
export const generateUniqueId = (prefix = 'id') => {
  idCounter++;
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}-${timestamp}-${idCounter}-${random}`;
};

/**
 * Generates a unique notification ID
 * @returns {string} Unique notification ID
 */
export const generateNotificationId = () => generateUniqueId('notification');

/**
 * Generates a unique message ID for chat
 * @returns {string} Unique message ID
 */
export const generateMessageId = () => generateUniqueId('message');

/**
 * Generates a unique key for list items
 * @param {string} prefix - Prefix for the key
 * @returns {string} Unique key
 */
export const generateListKey = (prefix = 'item') => generateUniqueId(prefix);

export default {
  generateUniqueId,
  generateNotificationId,
  generateMessageId,
  generateListKey
};
