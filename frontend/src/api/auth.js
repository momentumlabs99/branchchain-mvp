import { useNavigate } from "react-router-dom";
export default function login(data) {
  return fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function logout(navigate) {
  try {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (!res.ok) throw new Error("Logout failed");

    // clear local stuff from browser
    localStorage.removeItem("token");

    // redirect
    navigate("/login");
  } catch (err) {
    console.error(err);
  }
}
