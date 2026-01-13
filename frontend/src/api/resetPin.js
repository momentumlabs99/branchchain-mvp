export default function resetPin(accountId, newPin) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    throw new Error("User not logged in");
  }

  const payload = {
    accountId,
    newPin,
    staffId: user.id,
    branchId: user.branchId,
  };

  return fetch("/api/accounts/reset-pin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
