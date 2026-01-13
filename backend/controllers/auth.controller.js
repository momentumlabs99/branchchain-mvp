const authService = require("../services/auth.service");
const ledgerService = require("../services/ledger.service");
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

    // Record login to ledger
    //await ledgerService.recordTransaction("STAFF_LOGIN", {
    //  staffId: staff.id,
    //  staffName: staff.name,
    //  branchId: staff.branchId,
    //});

    // Return staff data (without password)
    return success(res, {
      id: staff.id,
      name: staff.name,
      branchId: staff.branchId,
      role: staff.role,
    });

  } catch (err) {
    return error(res, err.message, 500);
  }
}

module.exports = { login };
