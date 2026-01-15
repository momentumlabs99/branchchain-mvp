import axios from "axios";
import API_URL from "./api";

// LOGIN
export default async function login(data) {
  try {
    const res = await axios.post(`${API_URL}/api/auth/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = res.data;

    // store token
    localStorage.setItem("token", result.token);

    return result;
  } catch (error) {
    const message = error.response?.data?.message || "Login failed";
    throw new Error(message);
  }
}

// LOGOUT
export async function logout(navigate) {
  try {
    await axios.post(`${API_URL}/api/auth/logout`);

    // clear local storage
    localStorage.removeItem("token");

    // redirect
    navigate("/login");
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
}
