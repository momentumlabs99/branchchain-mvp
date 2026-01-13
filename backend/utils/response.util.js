/**
 * Send success response
 * @param {object} res - Express response object
 * @param {any} data - Response data
 * @param {number} status - HTTP status code
 */
function success(res, data, status = 200) {
  return res.status(status).json({
    success: true,
    data,
  });
}

/**
 * Send error response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 */
function error(res, message, status = 500) {
  return res.status(status).json({
    success: false,
    error: message,
  });
}

module.exports = { success, error };
