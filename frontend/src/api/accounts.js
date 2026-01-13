export default function createAccount(data) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    throw new Error("User not logged in");
  }

  const accountTypeMapping = {
    checking: "CURRENT",
    savings: "SAVINGS",
    investment: "INVESTMENT",
    business: "BUSINESS",
  };

  const payload = {
    customerId: data.nationalId, // Using nationalId as customerId
    accountType:
      accountTypeMapping[data.accountType] || data.accountType.toUpperCase(),
    initialDeposit: parseFloat(data.deposit) || 0,
    staffId: user.id,
    branchId: user.branchId,
  };

  return fetch("/api/accounts/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
