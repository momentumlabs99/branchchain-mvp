const authService = require("../services/auth.service");
const ledgerService = require("../services/ledger-gateway.service");
const jwtService = require("../services/jwt.service");
const { success, error } = require("../utils/response.util");

/**
 * Staff login
 */
async function login(req, res) {
  try {
    const { staffId, password } = req.body;

    // Validate input
    if (!staffId || !password) {
      return error(res, "Staff ID and password required", 400);
    }

    // Authenticate staff
    const staff = await authService.authenticateStaff(staffId, password);

    if (!staff) {
      return error(res, "Invalid credentials", 401);
    }

    // Generate JWT token
    const token = jwtService.generateToken({
      id: staff.id,
      branchId: staff.branchId,
      role: staff.role,
    });

    // Record login to ledger
    await ledgerService.recordTransaction("STAFF_LOGIN", {
      staffId: staff.id,
      staffName: staff.name,
      branchId: staff.branchId,
    });

    // Return staff data with token
    return success(res, {
      token,
      staff: {
        id: staff.id,
        name: staff.name,
        branchId: staff.branchId,
        role: staff.role,
      },
    });

  } catch (err) {
    return error(res, err.message, 500);
  }
}

/**
 * Staff logout
 */
async function logout(req, res) {
  try {
    // Get staff information from JWT token (attached by authenticate middleware)
    const staff = req.user;

    if (!staff) {
      return error(res, "No active session found", 401);
    }

    // Record logout to ledger
    await ledgerService.recordTransaction("STAFF_LOGOUT", {
      staffId: staff.id,
      staffName: staff.name || "Unknown",
      branchId: staff.branchId,
    });

    // Clear token on client side (handled on frontend)
    // In a real implementation, you might want to add token to blacklist

    return success(res, { message: "Logged out successfully" });

  } catch (err) {
    return error(res, err.message, 500);
  }
}

module.exports = { login, logout };
