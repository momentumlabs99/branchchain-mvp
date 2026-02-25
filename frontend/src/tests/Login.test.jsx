import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import login from "../api/auth";

// Mock the auth API
vi.mock("../api/auth", () => ({
  default: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form correctly", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByTestId("staffId")).toBeInTheDocument();
    expect(screen.getByTestId("password")).toBeInTheDocument();
    expect(screen.getByTestId("login-submit")).toBeInTheDocument();
  });

  it("handles input changes", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const staffIdInput = screen.getByTestId("staffId");
    const passwordInput = screen.getByTestId("password");

    fireEvent.change(staffIdInput, { target: { value: "STF-123" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(staffIdInput.value).toBe("STF-123");
    expect(passwordInput.value).toBe("password123");
  });

  it("calls login API and redirects on success", async () => {
    login.mockResolvedValueOnce({ token: "fake-token", staff: { id: "STF-123" } });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId("staffId"), { target: { value: "STF-123" } });
    fireEvent.change(screen.getByTestId("password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByTestId("login-submit"));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({ staffId: "STF-123", password: "password123" });
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("displays error message on login failure", async () => {
    login.mockRejectedValueOnce(new Error("Invalid credentials"));

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId("staffId"), { target: { value: "STF-123" } });
    fireEvent.change(screen.getByTestId("password"), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByTestId("login-submit"));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});
