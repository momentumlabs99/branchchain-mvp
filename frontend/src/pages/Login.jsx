import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    staffId: "",
    branch: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", formData);
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row overflow-hidden">
      {/* Left Pane: Branding & Hero */}
      <div className="relative flex w-full lg:w-5/12 flex-col justify-between bg-slate-900 p-8 lg:p-12 text-white overflow-hidden">
        {/* Background pattern/image */}
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC8dBwPt7sUMQYgVEdaO-gB02AjLSa6A2aCqjHDjUq4icYZz1eKLB_DDKg9RzzBR0qXGDv4WISmQ8w4hx_TiY7xLzlHivKZ6jsc1silWBOr_4t4Cwbk3D8o3HIm02oVp5qAQi1PKDqjpRJ_-JmAU-OlKo5CQCoGCtJxtRWxZQQGnkJRnLEfW5VRUtY1J6EAt7YFde9LlAKM5bB_bYmvrKMDm6t7kB9eTuVMlAj3V0zn-MXk2E55nZTqQP3QV7woEkBteYgqTKZ_3e8z')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900/50 via-slate-900/20 to-slate-900/90" />

        {/* Header Content */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
            <span className="material-symbols-outlined">account_balance</span>
          </div>
          <span className="text-2xl font-black tracking-tight">
            BranchChain
          </span>
        </div>

        {/* Main Visual Content */}
        <div className="relative z-10 my-auto flex flex-col gap-6 py-12">
          <h1 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Secure Accounts <br />
            Management Portal
          </h1>
          <p className="max-w-md text-lg text-slate-100">
            Access the internal banking infrastructure to manage customer
            accounts, Troubleshoot issues, and audit ledger entries securely.
          </p>
        </div>

        {/* Footer Content */}
        <div className="relative z-10 text-sm text-slate-500">
          <p>Internal Banking Infrastructure v2.4</p>
          <p className="mt-1">
            © {new Date().getFullYear()} BranchChain Systems. All rights
            reserved.
          </p>
        </div>
      </div>

      {/* Right Pane: Login Form */}
      <div className="flex w-full lg:w-7/12 flex-col items-center justify-center bg-slate-50 p-6 lg:p-24">
        <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-sm ring-1 ring-slate-900/5 rounded-xl">
          {/* Form Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Log In
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Please enter your staff credentials to access the terminal.
            </p>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-5">
              {/* Staff ID */}
              <div>
                <label
                  htmlFor="staffId"
                  className="block text-sm font-medium leading-6 text-slate-900"
                >
                  Staff ID
                </label>
                <div className="relative mt-2 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="material-symbols-outlined text-slate-400 text-[20px]">
                      badge
                    </span>
                  </div>
                  <input
                    type="text"
                    name="staffId"
                    id="staffId"
                    value={formData.staffId}
                    onChange={handleInputChange}
                    placeholder="Ex: STF-8821"
                    className="block w-full rounded-md border-0 py-3 pl-10 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Branch Selection */}
              <div>
                <label
                  htmlFor="branch"
                  className="block text-sm font-medium leading-6 text-slate-900"
                >
                  Branch Location
                </label>
                <div className="relative mt-2 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="material-symbols-outlined text-slate-400 text-[20px]">
                      store
                    </span>
                  </div>
                  <select
                    name="branch"
                    id="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 py-3 pl-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  >
                    <option value="">Select Branch...</option>
                    <option value="NRB-001">Nairobi - HQ (NRB-001)</option>
                    <option value="MSA-042">
                      Mombasa - Port City (MSA-042)
                    </option>
                    <option value="KSM-089">Kisumu - Lakeside (KSM-089)</option>
                    <option value="NKR-156">Nakuru - Central (NKR-156)</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-slate-900"
                >
                  Password
                </label>
                <div className="relative mt-2 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="material-symbols-outlined text-slate-400 text-[20px]">
                      lock
                    </span>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter secure phrase"
                    className="block w-full rounded-md border-0 py-3 pl-10 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer group focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-600 text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-slate-900"
                >
                  Remember device
                </label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-primary hover:text-blue-500 hover:underline"
                  onClick={() => console.log("Forgot password clicked")}
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-primary px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
              >
                Log in
              </button>
            </div>

            {/* Warning/Help Text */}
            <div className="mt-4 rounded-md bg-yellow-50 p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="material-symbols-outlined text-yellow-600 text-[20px]">
                    warning
                  </span>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-xs text-yellow-700">
                    Unauthorized access is prohibited and monitored. All actions
                    are logged.
                  </p>
                </div>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Need help?{" "}
            <button
              type="button"
              className="font-medium text-slate-600 hover:text-slate-800 hover:underline"
              onClick={() => console.log("Contact support clicked")}
            >
              Contact IT Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
