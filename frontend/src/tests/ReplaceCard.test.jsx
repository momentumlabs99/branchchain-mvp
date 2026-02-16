import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ReplaceCard from "../pages/ReplaceCard";
import { replaceCard } from "../api/cards";

// Mock APIs
vi.mock("../api/cards", () => ({
  replaceCard: vi.fn(),
}));

// Mock AccountLookup since it's a complex child component
vi.mock("../components/AccountLookup", () => ({
  default: ({ onResult }) => (
    <button
      data-testid="mock-lookup-btn"
      onClick={() =>
        onResult({
          accountId: "ACC-123",
          cardNumber: "1111-2222-3333-4444",
          cardStatus: "ACTIVE",
          ownerName: "John Doe",
        })
      }
    >
      Simulate Account Found
    </button>
  ),
}));

describe("ReplaceCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders replace card form", () => {
    render(<ReplaceCard />);
    expect(screen.getByRole("heading", { name: /Replace Card/i })).toBeInTheDocument();
  });

  it("validates and calls replaceCard API on submit", async () => {
    replaceCard.mockResolvedValueOnce({ transactionId: "TX-999" });

    render(<ReplaceCard />);

    // Simulate finding an account
    fireEvent.click(screen.getByTestId("mock-lookup-btn"));

    // Check if card details are shown
    await waitFor(() => {
	    expect(screen.getByText(/1111-2222-3333-4444/i)).toBeInTheDocument();
    });

    // Fill form - ensure elements are present
    const serialInput = await screen.findByTestId("new-card-serial");
    fireEvent.change(serialInput, { target: { value: "SN-555" } });
    fireEvent.change(screen.getByTestId("replacement-reason"), { target: { value: "lost" } });

    // Submit
    const submitBtn = screen.getByRole("button", { name: /Replace Card/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(replaceCard).toHaveBeenCalledWith({
        accountId: "ACC-123",
        oldCardNumber: "1111-2222-3333-4444",
        newCardSerial: "SN-555",
        reason: "lost",
      });
      expect(screen.getByText(/Success: Card replaced/i)).toBeInTheDocument();
    });
  });

  it("displays error when API fails", async () => {
    replaceCard.mockRejectedValueOnce(new Error("Card not found"));

    render(<ReplaceCard />);
    fireEvent.click(screen.getByTestId("mock-lookup-btn"));
    
    await waitFor(() => {
        expect(screen.getByTestId("new-card-serial")).toBeInTheDocument();
    });

    const serialInput = screen.getByTestId("new-card-serial");
    fireEvent.change(serialInput, { target: { value: "SN-555" } });
    fireEvent.change(screen.getByTestId("replacement-reason"), { target: { value: "lost" } });
    
    fireEvent.click(screen.getByRole("button", { name: /Replace Card/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error: Card not found/i)).toBeInTheDocument();
    });
  });
});
