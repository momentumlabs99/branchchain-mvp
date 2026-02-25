import { useState } from "react";
import AccountLookup from "../components/AccountLookup";
import { getCardsByAccount, replaceCard } from "../api/cards";

const ReplaceCard = () => {
  const [searchAccount, setSearchAccount] = useState("");
  const [accountLoaded, setAccountLoaded] = useState(false);
  const [currentCard, setCurrentCard] = useState({
    accountId: "",
    accountNumber: "",
    customerName: "",
    cardNumber: "",
    expiryDate: "",
    cardType: "",
    status: "",
  });
  const [cards, setCards] = useState([]);
  const [newCardSerial, setNewCardSerial] = useState("");
  const [replacementReason, setReplacementReason] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardsLoading, setCardsLoading] = useState(false);

  const handleAccountFound = async (result) => {
    if (result) {
      setCurrentCard({
        accountId: result.accountId || "",
        accountNumber: result.accountNumber || "",
        customerName: result.customerName || "",
        cardNumber: "", // Will be populated from cards list
        expiryDate: "",
        cardType: "",
        status: "",
      });
      setAccountLoaded(true);
      setStatus("");

      // Fetch cards for this account
      await fetchCards(result.accountId);
    } else {
      setStatus("Account not found");
      setAccountLoaded(false);
    }
  };

  const fetchCards = async (accountId) => {
    setCardsLoading(true);
    try {
      const cardsData = await getCardsByAccount(accountId);
      setCards(cardsData);

      // Set the current active card
      const activeCard = cardsData.find(card => card.status === "ACTIVE");
      if (activeCard) {
        setCurrentCard(prev => ({
          ...prev,
          cardNumber: activeCard.cardNumber,
          expiryDate: activeCard.expiryDate,
          cardType: activeCard.cardType,
          status: activeCard.status,
        }));
      }
    } catch (err) {
      setStatus(err.message || "Failed to load cards");
    } finally {
      setCardsLoading(false);
    }
  };

  const handleReplaceCard = async () => {
    console.log("handleReplaceCard called with:", {
      accountId: currentCard.accountId,
      cardNumber: currentCard.cardNumber,
      newCardSerial,
      replacementReason,
    });

    if (!currentCard.accountId || !currentCard.cardNumber || !newCardSerial || !replacementReason) {
      setStatus("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("User from localStorage:", user);

      const result = await replaceCard({
        accountId: currentCard.accountId,
        oldCardNumber: currentCard.cardNumber,
        newCardSerial,
        reason: replacementReason,
        staffId: user?.id,
        branchId: user?.branchId,
      });
      console.log("Replace card result:", result);

      setStatus(`Success: Card replaced. Transaction ID: ${result.transactionId || 'N/A'}`);
      // Reset form on success
      setNewCardSerial("");
      setReplacementReason("");
      setAccountLoaded(false);
      setCurrentCard({
        accountId: "",
        accountNumber: "",
        customerName: "",
        cardNumber: "",
        expiryDate: "",
        cardType: "",
        status: "",
      });
      setSearchAccount("");
      setCards([]);
    } catch (err) {
      console.error("Replace card error:", err);
      setStatus(err.message || "Failed to replace card");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchAccount("");
    setAccountLoaded(false);
    setCurrentCard({
      accountId: "",
      accountNumber: "",
      customerName: "",
      cardNumber: "",
      expiryDate: "",
      cardType: "",
      status: "",
    });
    setNewCardSerial("");
    setReplacementReason("");
    setStatus("");
    setCards([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full flex flex-col gap-6 pb-12">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Replace Card</h1>
          <p className="text-sm text-gray-600 mt-1">
            Search for account and issue replacement card
          </p>
        </div>

        {/* Status Message */}
        {status && (
          <div
            className={`p-4 border rounded text-sm ${
              status.toLowerCase().includes("success")
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {status}
          </div>
        )}

        {/* Search Box */}
        <AccountLookup
          value={searchAccount}
          onChange={setSearchAccount}
          onResult={handleAccountFound}
          disabled={accountLoaded}
          loaded={accountLoaded}
          onReset={handleReset}
          error={status === "Account not found" ? status : ""}
        />

        {/* Cards List - Shows after account search */}
        {accountLoaded && (
          <div>
            {cardsLoading ? (
              <div className="bg-white rounded border border-gray-200 p-6">
                <p className="text-gray-600">Loading cards...</p>
              </div>
            ) : cards.length > 0 ? (
              <div className="bg-white rounded border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Cards for this Account
                </h2>
                <div className="space-y-2">
                  {cards.map((card) => (
                    <div
                        key={card.id}
                        className={`flex items-center justify-between p-3 border rounded ${
                          card.status === "ACTIVE" ? "border-green-300 bg-green-50" : "border-gray-200"
                        }`}
                      >
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-1">
                          <p className="font-medium text-gray-900 font-mono">
                            {card.cardNumber}
                          </p>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded ${
                              card.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {card.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span>Type: {card.cardType}</span>
                          <span>Expires: {card.expiryDate || "N/A"}</span>
                          <span className="font-mono">
                            Serial: <strong className="text-blue-600">{card.cardSerial}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> When replacing a card, use the <strong>Card Serial</strong> (the value shown in blue above) for the new card, not the card number.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 p-6">
                <p className="text-yellow-800">
                  No cards found for this account. Please create cards before attempting replacement.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Card Replacement Form */}
        {accountLoaded && currentCard.cardNumber && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Current Card Info */}
            <div className="bg-white rounded border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Current Card
                </h2>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                  {currentCard.status}
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Account Number
                  </label>
                  <p className="text-sm text-gray-900">
                    {currentCard.accountNumber}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Customer Name
                  </label>
                  <p className="text-sm text-gray-900">
                    {currentCard.customerName}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Card Number
                  </label>
                  <p className="text-sm text-gray-900 font-mono">
                    {currentCard.cardNumber}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Card Type
                    </label>
                    <p className="text-sm text-gray-900">
                      {currentCard.cardType || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Expiry Date
                    </label>
                    <p className="text-sm text-gray-900">
                      {currentCard.expiryDate || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* New Card Details */}
            <div className="bg-white rounded border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                New Card Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="newCardSerial" className="block text-sm font-medium text-gray-700 mb-1">
                    New Card Serial Number *
                  </label>
                  <input
                    type="text"
                    id="newCardSerial"
                    data-testid="new-card-serial"
                    value={newCardSerial}
                    onChange={(e) => setNewCardSerial(e.target.value)}
                    placeholder="e.g., CS123456 (from the cards list above)"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    <strong>Important:</strong> Enter the <span className="text-blue-600">Card Serial</span> (shown in blue in the cards list above), NOT the card number
                  </p>
                </div>
                <div>
                  <label htmlFor="replacementReason" className="block text-sm font-medium text-gray-700 mb-1">
                    Replacement Reason *
                  </label>
                  <select
                    id="replacementReason"
                    data-testid="replacement-reason"
                    value={replacementReason}
                    onChange={(e) => setReplacementReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select reason</option>
                    <option value="lost">Lost</option>
                    <option value="stolen">Stolen</option>
                    <option value="damaged">Damaged</option>
                    <option value="expired">Expired</option>
                    <option value="fraudulent">Fraudulent Activity</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {accountLoaded && currentCard.cardNumber && (
          <div className="flex justify-end gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleReplaceCard}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Replacing..." : "Replace Card"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReplaceCard;
