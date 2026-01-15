import axios from "axios";
import API_URL from "./api";

export async function createCustomer(data) {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${API_URL}/api/customers`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  } catch (error) {
    const message = error.response?.data?.error || "Customer creation failed";
    throw new Error(message);
  }
}

export async function getCustomer(customerId) {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/api/customers/${customerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to get customer";
    throw new Error(message);
  }
}

export async function getAllCustomers() {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/api/customers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  } catch (error) {
    const message = error.response?.data?.error || "Failed to get customers";
    throw new Error(message);
  }
}
