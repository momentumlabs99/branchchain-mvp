import { useState } from "react";
import { createCard } from "../api/cards";
import { getCardsByAccount } from "../api/cards";

export default function ManageCards() {
  const [accountId, setAccountId] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [newCard, setNewCard] = useState({
    cardNumber: "",
    cardSerial: "",
    cardType: "DEBIT",
    expiryDate: "",
    staffId: "STAFF001",
    branchId: "branch1",
  });

  const handleFetchCards = async () => {
    if (!accountId) {
      setMessage({ type: "error", text: "Please enter an account ID" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await getCardsByAccount(accountId);
      setCards(result);
      setMessage({ type: "success", text: `Found ${result.length} card(s)` });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCard = async (e) => {
    e.preventDefault();

    if (!accountId) {
      setMessage({ type: "error", text: "Please enter an account ID first" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const cardData = {
        ...newCard,
        accountId,
      };

      await createCard(cardData);
      setMessage({ type: "success", text: "Card created successfully!" });
      
      // Reset form
      setNewCard({
        cardNumber: "",
        cardSerial: "",
        cardType: "DEBIT",
        expiryDate: "",
        staffId: "STAFF001",
        branchId: "branch1",
      });

      // Refresh cards
      await handleFetchCards();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Manage Cards</h1>

      {message && (
        <div
          style={{
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "4px",
            backgroundColor: message.type === "error" ? "#fee" : "#efe",
            color: message.type === "error" ? "#c00" : "#080",
            border: `1px solid ${message.type === "error" ? "#f99" : "#9c9"}`,
          }}
        >
          {message.text}
        </div>
      )}

      {/* Account Lookup */}
      <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h2>Account Lookup</h2>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Enter Account ID (e.g., ACC17716017301884099)"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
          <button
            onClick={handleFetchCards}
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "14px",
            }}
          >
            {loading ? "Loading..." : "Fetch Cards"}
          </button>
        </div>
      </div>

      {/* Create Card Form */}
      <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h2>Create New Card</h2>
        <form onSubmit={handleCreateCard}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Card Number *
              </label>
              <input
                type="text"
                placeholder="16-digit card number"
                value={newCard.cardNumber}
                onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                required
                maxLength={16}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Card Serial *
              </label>
              <input
                type="text"
                placeholder="Unique card serial (e.g., CS123456)"
                value={newCard.cardSerial}
                onChange={(e) => setNewCard({ ...newCard, cardSerial: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  fontWeight: "monospace",
                }}
              />
              <p style={{ fontSize: "12px", color: "#666", marginTop: "3px" }}>
                Use this serial when replacing cards
              </p>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Card Type
              </label>
              <select
                value={newCard.cardType}
                onChange={(e) => setNewCard({ ...newCard, cardType: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              >
                <option value="DEBIT">Debit</option>
                <option value="CREDIT">Credit</option>
                <option value="PREPAID">Prepaid</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Expiry Date
              </label>
              <input
                type="month"
                value={newCard.expiryDate}
                onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Staff ID
              </label>
              <input
                type="text"
                value={newCard.staffId}
                onChange={(e) => setNewCard({ ...newCard, staffId: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Branch ID
              </label>
              <input
                type="text"
                value={newCard.branchId}
                onChange={(e) => setNewCard({ ...newCard, branchId: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !accountId}
            style={{
              marginTop: "15px",
              padding: "12px 24px",
              backgroundColor: loading || !accountId ? "#ccc" : "#388e3c",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading || !accountId ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {loading ? "Creating..." : "Create Card"}
          </button>
        </form>
      </div>

      {/* Cards List */}
      <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h2>Cards for Account {accountId || "(none selected)"}</h2>
        {cards.length === 0 ? (
          <p style={{ color: "#666", fontStyle: "italic" }}>
            No cards found for this account. Create cards above to test replacement.
          </p>
        ) : (
          <div style={{ display: "grid", gap: "15px" }}>
            {cards.map((card) => (
              <div
                key={card.id || card._id}
                style={{
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: card.status === "ACTIVE" ? "#f0f9f0" : "#f9f0f0",
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
                  <div>
                    <strong>Card ID:</strong> {card.id || card._id}
                  </div>
                  <div>
                    <strong>Card Number:</strong> {card.cardNumber}
                  </div>
                  <div>
                    <strong>Card Serial:</strong> <span style={{ fontFamily: "monospace", fontWeight: "bold", color: "#1976d2" }}>{card.cardSerial}</span>
                  </div>
                  <div>
                    <strong>Type:</strong> {card.cardType}
                  </div>
                  <div>
                    <strong>Status:</strong>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        backgroundColor: card.status === "ACTIVE" ? "#4caf50" : "#f44336",
                        color: "white",
                        marginLeft: "8px",
                      }}
                    >
                      {card.status}
                    </span>
                  </div>
                  <div>
                    <strong>Expiry:</strong> {card.expiryDate || "N/A"}
                  </div>
                </div>
                {card.status !== "ACTIVE" && (
                  <div style={{ marginTop: "10px", padding: "5px 10px", backgroundColor: "#fff3cd", borderRadius: "4px", fontSize: "12px", color: "#856404" }}>
                    <strong>Tip:</strong> Use the <strong>Card Serial</strong> ({card.cardSerial}) when replacing cards
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}