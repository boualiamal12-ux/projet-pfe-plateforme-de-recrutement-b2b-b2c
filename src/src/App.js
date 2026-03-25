import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";

import LandingPage       from "./components/LandingPage";
import Login             from "./components/Login";
import Register          from "./components/Register";
import ForgotPassword    from "./components/ForgotPassword";
import ResetPassword     from "./components/ResetPassword";
import GestionOffres     from "./components/Gestionoffres";
import AdminDashboard    from "./components/AdminDashboard";
import VerifyEmail       from "./components/VerifyEmail";
import DashboardCandidat from "./components/DashboardCandidat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"                element={<LandingPage />} />
        <Route path="/login"           element={<LoginWrapper />} />
        <Route path="/register"        element={<RegisterWrapper />} />
        <Route path="/forgot-password" element={<ForgotPasswordWrapper />} />
        <Route path="/reset-password"  element={<ResetPasswordWrapper />} />
        <Route path="/dashboard"       element={<DashboardWrapper />} />
        <Route path="/admin"           element={<AdminWrapper />} />
        <Route path="/verify-email"    element={<VerifyEmail />} />
        <Route path="*"                element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

const LoginWrapper = () => {
  const navigate = useNavigate();
  return (
    <Login
      goRegister={() => navigate("/register")}
      goForgot={() => navigate("/forgot-password")}
      onLoginSuccess={(role) => {
        localStorage.setItem("role", role);
        if (role === "ADMIN") navigate("/admin");
        else navigate("/dashboard");
      }}
    />
  );
};

const DashboardWrapper = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const handleLogout = () => { localStorage.clear(); navigate("/login"); };
  if (role === "ENTREPRISE") return <GestionOffres onLogout={handleLogout} />;
  if (role === "CANDIDAT")   return <DashboardCandidat onLogout={handleLogout} />;
  return <Navigate to="/login" />;
};

const RegisterWrapper       = () => { const navigate = useNavigate(); return <Register goLogin={() => navigate("/login")} />; };
const ForgotPasswordWrapper = () => { const navigate = useNavigate(); return <ForgotPassword goLogin={() => navigate("/login")} />; };
const ResetPasswordWrapper  = () => { const navigate = useNavigate(); return <ResetPassword goLogin={() => navigate("/login")} />; };
const AdminWrapper          = () => { const navigate = useNavigate(); return <AdminDashboard onLogout={() => { localStorage.clear(); navigate("/login"); }} />; };

export default App;