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

    const result = res.data.data; // Access the nested data object

    // store token and user data
    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.staff));

    return result;
  } catch (error) {
    const message = error.response?.data?.error || "Login failed";
    throw new Error(message);
  }
}

// LOGOUT
export async function logout(navigate) {
  try {
    const token = localStorage.getItem("token");
    await axios.post(
      `${API_URL}/api/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  } catch (error) {
    console.error(error.response?.data || error.message);
    // Force logout locally even if backend fails
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }
}
