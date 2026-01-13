// sample staff database
const staffDatabase = [
  {
    id: "STAFF001",
    name: "John Doe",
    password: "password123",
    branchId: "BRANCH001",
    role: "MANAGER",
  },
  {
    id: "STAFF002",
    name: "Jane Smith",
    password: "password123",
    branchId: "BRANCH001",
    role: "TELLER",
  },
];

/**
 * Authenticate staff member
 * @param {string} staffId - Staff ID
 * @param {string} password - Password
 * @returns {Promise<object|null>} Staff object or null
 */
async function authenticateStaff(staffId, password) {
  const staff = staffDatabase.find(
    (s) => s.id === staffId && s.password === password
  );

  if (!staff) {
    return null;
  }

  // Return staff without password
  const { password: _, ...staffWithoutPassword } = staff;
  return staffWithoutPassword;
}

module.exports = {
  authenticateStaff,
};
