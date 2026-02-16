import { useState } from "react";
import AccountLookup from "../components/AccountLookup";
import { replaceCard } from "../api/cards";

const ReplaceCard = () => {
  const [searchAccount, setSearchAccount] = useState("");
  const [cardLoaded, setCardLoaded] = useState(false);
  const [currentCard, setCurrentCard] = useState({
    accountNumber: "",
    customerName: "",
    cardNumber: "",
    expiryDate: "",
    cardType: "",
    status: "",
  });
  const [newCardSerial, setNewCardSerial] = useState("");
  const [replacementReason, setReplacementReason] = useState("");
  const [status, setStatus] = useState("");

  const handleSearch = () => {
    // Handled by AccountLookup component
  };

  const handleReplaceCard = async () => {
    if (!newCardSerial || !replacementReason) {
      setStatus("Please fill in all required fields");
      return;
    }

    try {
      setStatus("Processing replacement...");
      const result = await replaceCard({
        accountId: currentCard.accountId,
        oldCardNumber: currentCard.cardNumber,
        newCardSerial,
        reason: replacementReason,
      });

      setStatus(`Success: Card replaced. Transaction ID: ${result.transactionId}`);
    } catch (error) {
       setStatus(`Error: ${error.message}`);
    }
  };

  const handleReset = () => {
    setSearchAccount("");
    setCardLoaded(false);
    setCurrentCard({
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
              status.includes("success")
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
          onResult={(result) => {
            if (result) {
              setCurrentCard(result);
              setCardLoaded(true);
              setStatus("");
            } else {
              setStatus("Account not found");
              setCardLoaded(false);
            }
          }}
          disabled={cardLoaded}
          loaded={cardLoaded}
          onReset={handleReset}
          error={status === "Account not found" ? status : ""}
        />

        {/* Card Replacement Form */}
        {cardLoaded && (
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
                      {currentCard.cardType}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Expiry Date
                    </label>
                    <p className="text-sm text-gray-900">
                      {currentCard.expiryDate}
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
                    placeholder="Enter new card serial"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Scan or enter the serial number from the new card
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
        {cardLoaded && (
          <div className="flex justify-end gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleReplaceCard}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Replace Card
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReplaceCard;
