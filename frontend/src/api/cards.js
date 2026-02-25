import axios from "axios";
import API_URL from "./api";

export async function createCard(data) {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${API_URL}/api/cards`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("createCard API response:", res.status, res.data);
    return res.data;
  } catch (error) {
    console.error("createCard API error:", error);
    const message = error.response?.data?.error || "Card creation failed";
    throw new Error(message);
  }
}

export async function getCardsByAccount(accountId) {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/api/cards/account/${accountId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  } catch (error) {
    const message = error.response?.data?.error || "Failed to get cards";
    throw new Error(message);
  }
}

export async function replaceCard(data) {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!token || !user) {
      throw new Error("User not logged in");
    }

    const payload = {
      ...data,
      staffId: user.id,
      branchId: user.branchId,
    };

    const res = await axios.post(`${API_URL}/api/cards/replace`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log("replaceCard API response:", res.status, res.data);
    return res.data.data;
  } catch (error) {
    console.error("replaceCard API error:", error);
    const message = error.response?.data?.error || "Card replacement failed";
    throw new Error(message);
  }
}

export default replaceCard;
