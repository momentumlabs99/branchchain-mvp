const jwtService = require("../services/jwt.service");
const { error } = require("../utils/response.util");

/**
 * Verify JWT token from request header
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return error(res, "No token provided", 401);
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  const decoded = jwtService.verifyToken(token);

  if (!decoded) {
    return error(res, "Invalid or expired token", 401);
  }

  // Attach user info to request
  req.user = decoded;
  next();
}

module.exports = { authenticate };
