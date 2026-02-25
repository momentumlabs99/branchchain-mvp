import axios from "axios";
import API_URL from "./api";

const auditApi = {
  /**
   * Fetch all audit logs from the ledger
   * @returns {Promise<Array>} List of transactions
   */
  /**
   * Fetch all audit logs from the ledger
   * @param {Object} params - Query parameters (page, limit, search, etc.)
   * @returns {Promise<Object>} List of transactions and pagination metadata
   */
  getAllLogs: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/api/audit`, { params });
      // The backend returns { pagination: {...}, filters: [...], transactions: [] }
      return response.data;
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      throw error;
    }
  },

  /**
   * Fetch a single audit log by Transaction ID
   * @param {string} txId 
   * @returns {Promise<Object>} Transaction details
   */
  getLogById: async (txId) => {
    try {
      const response = await axios.get(`${API_URL}/api/audit/${txId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching audit log ${txId}:`, error);
      throw error;
    }
  }
};

export default auditApi;
