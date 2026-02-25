import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UpdateKYC from "../pages/UpdateKYC";
import { updateCustomerKYC } from "../api/customers";

// Mock API
vi.mock("../api/customers", () => ({
  updateCustomerKYC: vi.fn(),
}));

// Mock AccountLookup
vi.mock("../components/AccountLookup", () => ({
  default: ({ onResult }) => (
    <button
      data-testid="mock-lookup-btn"
      onClick={() => {
        onResult({
          accountNumber: "1234567890",
          customerId: "CUST-001",
          email: "old@example.com",
          phone: "555-0000",
          address: "123 Old St",
          city: "Old City",
          state: "Old State",
          zipCode: "00000",
        });
      }}
    >
        Simulate Customer Found
    </button>
  ),
}));

describe("UpdateKYC Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders update KYC form", () => {
    render(<UpdateKYC />);
    expect(screen.getByRole("heading", { name: /Update KYC Information/i })).toBeInTheDocument();
  });

  it("populates form with customer data on lookup", async () => {
    render(<UpdateKYC />);
    fireEvent.click(screen.getByTestId("mock-lookup-btn"));

    // Wait for the Customer section heading to appear
    await waitFor(() => {
        expect(screen.getByRole("heading", { name: "Customer" })).toBeInTheDocument();
    }, { timeout: 3000 });

    // Now check inputs
    expect(screen.getByDisplayValue("old@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("555-0000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123 Old St")).toBeInTheDocument();
  });

  it("calls updateCustomerKYC API on submit", async () => {
    updateCustomerKYC.mockResolvedValueOnce({ customerId: "CUST-001" });

    render(<UpdateKYC />);
    fireEvent.click(screen.getByTestId("mock-lookup-btn"));

    // Wait for form
    await waitFor(() => {
        expect(screen.getByRole("heading", { name: "Customer" })).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Update fields
    const emailInput = screen.getByDisplayValue("old@example.com");
    fireEvent.change(emailInput, { target: { value: "new@example.com" } });
    
    // Use getByTestId for city as it might be easier
    fireEvent.change(screen.getByTestId("city"), { target: { value: "New City" } });

    // Submit - Button text is "Update KYC"
    fireEvent.click(screen.getByRole("button", { name: /Update KYC/i }));

    await waitFor(() => {
      expect(updateCustomerKYC).toHaveBeenCalledWith("CUST-001", expect.objectContaining({
        email: "new@example.com",
        address: expect.objectContaining({ city: "New City" })
      }));
      expect(screen.getByText(/Success: KYC information updated/i)).toBeInTheDocument();
    });
  });

  it("displays error when API fails", async () => {
    updateCustomerKYC.mockRejectedValueOnce(new Error("Update failed"));

    render(<UpdateKYC />);
    fireEvent.click(screen.getByTestId("mock-lookup-btn"));
    
    await waitFor(() => {
        expect(screen.getByRole("heading", { name: "Customer" })).toBeInTheDocument();
    }, { timeout: 3000 });
    
    const emailInput = screen.getByDisplayValue("old@example.com");
    fireEvent.change(emailInput, { target: { value: "new@example.com" } });
    // Submit - Button text is "Update KYC"
    fireEvent.click(screen.getByRole("button", { name: /Update KYC/i }));

    await waitFor(() => {
        expect(screen.getByText(/Error: Update failed/i)).toBeInTheDocument();
    });
  });
});
