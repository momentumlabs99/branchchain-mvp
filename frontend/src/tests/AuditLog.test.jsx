import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AuditLog from "../pages/AuditLog";
import auditApi from "../api/audit";

// Mock API
vi.mock("../api/audit", () => ({
  default: {
    getAllLogs: vi.fn(),
  },
}));

describe("AuditLog Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    // Return a promise that never resolves to test loading state
    auditApi.getAllLogs.mockReturnValue(new Promise(() => {}));
    
    render(<AuditLog />);
    expect(screen.getByText(/Loading Blockchain Ledger/i)).toBeInTheDocument();
  });

  it("renders audit logs successfully", async () => {
    const mockData = {
      transactions: [
        {
          id: "tx1",
          txId: "tx1",
          timestamp: "2023-10-27T10:00:00Z",
          staffId: "STF-001",
          actionType: "LOGIN",
          details: { method: "POST" },
          blockchainHash: "0x123abc",
        },
      ],
      pagination: { total: 1, totalPages: 1 },
    };
    auditApi.getAllLogs.mockResolvedValue(mockData);

    render(<AuditLog />);

    await waitFor(() => {
      expect(screen.getByText("System")).toBeInTheDocument();
      expect(screen.getByText("Login")).toBeInTheDocument(); // Transformer might capitalize
    });
  });

  it("displays error message on API failure", async () => {
    auditApi.getAllLogs.mockRejectedValue(new Error("Network Error"));

    render(<AuditLog />);

    await waitFor(() => {
      expect(screen.getByText(/Unable to fetch logs/i)).toBeInTheDocument();
    });
  });

  it("triggers API call with correct params when filter changes", async () => {
    const mockData = { transactions: [], pagination: { total: 0 } };
    auditApi.getAllLogs.mockResolvedValue(mockData);

    render(<AuditLog />);

    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Change action filter
    const select = screen.getByDisplayValue("All Action Types"); // Assuming default value
    fireEvent.change(select, { target: { value: "CREATE_ACCOUNT" } });

    await waitFor(() => {
      expect(auditApi.getAllLogs).toHaveBeenCalledWith(expect.objectContaining({
        actionType: "CREATE_ACCOUNT"
      }));
    });
  });
  
  it("triggers API call with search params", async () => {
     const mockData = { transactions: [], pagination: { total: 0 } };
     auditApi.getAllLogs.mockResolvedValue(mockData);
 
     render(<AuditLog />);
     await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());
 
     const searchInput = screen.getByPlaceholderText(/Search Staff ID, Hash/i);
     fireEvent.change(searchInput, { target: { value: "STF-99" } });
 
     // Wait for debounce
     await waitFor(() => {
       expect(auditApi.getAllLogs).toHaveBeenCalledWith(expect.objectContaining({
         search: "STF-99"
       }));
     }, { timeout: 1000 });
   });
});
