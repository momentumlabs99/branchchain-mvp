import axios from "axios";
import API_URL from "./api";

export default async function resetPin(accountId, newPin) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!token || !user) {
    throw new Error("User not logged in");
  }

  const payload = {
    accountId,
    newPin,
    staffId: user.id,
    branchId: user.branchId,
  };

  try {
    const res = await axios.post(`${API_URL}/api/accounts/reset-pin`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    const message = error.response?.data?.error || "PIN reset failed";
    throw new Error(message);
  }
}
