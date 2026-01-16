import axios from "axios";
import API_URL from "./api";

export async function searchAccount(accountNumber) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User not logged in");
    }

    const res = await axios.get(`${API_URL}/api/accounts/search`, {
      params: { accountNumber },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  } catch (error) {
    const message = error.response?.data?.error || "Account search failed";
    throw new Error(message);
  }
}

export default async function createAccount(data) {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      throw new Error("User not logged in");
    }

    const accountTypeMapping = {
      checking: "CURRENT",
      savings: "SAVINGS",
      investment: "INVESTMENT",
      business: "BUSINESS",
    };

    const payload = {
      customerId: data.customerId,
      accountType:
        accountTypeMapping[data.accountType] || data.accountType.toUpperCase(),
      initialDeposit: parseFloat(data.initialDeposit) || 0,
      staffId: user.id,
      branchId: user.branchId,
    };

    const res = await axios.post(`${API_URL}/api/accounts/create`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  } catch (error) {
    const message = error.response?.data?.error || "Account creation failed";
    throw new Error(message);
  }
}
