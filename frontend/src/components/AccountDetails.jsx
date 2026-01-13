const AccountDetails = ({ customer, verified, onVerifiedChange }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-full">
      <h3 className="text-base font-bold text-slate-900 mb-4">
        Account Details
      </h3>

      {!customer ? (
        <p className="text-sm text-slate-500">
          Search for an account to view customer details.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs text-slate-500">Customer Name</p>
            <p className="font-medium text-slate-900">{customer.name}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Account Type</p>
            <p className="font-medium text-slate-900">{customer.accountType}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Status</p>
            <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              {customer.status}
            </span>
          </div>

          <div>
            <p className="text-xs text-slate-500">Phone</p>
            <p className="font-medium text-slate-900">{customer.phone}</p>
          </div>

          {/* Confirmation */}
          <label className="flex items-start gap-3 mt-4 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={verified}
              onChange={(e) => onVerifiedChange(e.target.checked)}
            />
            <span>
              I confirm this is the correct account and identity verification
              has been completed.
            </span>
          </label>
        </div>
      )}
    </div>
  );
};

export default AccountDetails;
