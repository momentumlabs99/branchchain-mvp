import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateAccount from "./pages/CreateAccount";
import ResetPin from "./pages/ResetPin";
import ReplaceCard from "./pages/ReplaceCard";
import UpdateKYC from "./pages/UpdateKYC";
import ManageCards from "./pages/ManageCards";
import AuditLog from "./pages/AuditLog";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/reset-pin" element={<ResetPin />} />
          <Route path="/replace-card" element={<ReplaceCard />} />
          <Route path="/update-kyc" element={<UpdateKYC />} />
          <Route path="/manage-cards" element={<ManageCards />} />
          <Route path="/audit-log" element={<AuditLog />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
