import axios from "axios";
import API_URL from "./api";

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

    return res.data.data;
  } catch (error) {
    const message = error.response?.data?.error || "Card replacement failed";
    throw new Error(message);
  }
}

export default replaceCard;
