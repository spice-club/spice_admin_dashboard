// src/App.tsx
import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css"; // Importing a CSS file for styles
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/privateRoute";
import { useAuth } from "./context/AuthContext";
import CRC from "./pages/crc";
import Login from "./pages/login";
import Quizform from "./pages/makeQuiz";
import ReferrerStatsPage from "./pages/referrerStats";
import sendNoti from "./pages/sendNoti";
import UserData from "./pages/userData";
import UserReferrals from "./pages/userReferral";

const App: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B] p-8">
        <h1 className="text-4xl font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Admin Dashboard
          </span>
        </h1>

        <NavBar isAuthenticated={isAuthenticated} onLogout={handleLogout} />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/user-referrals"
            element={<PrivateRoute component={UserReferrals} />}
          />
          <Route
            path="/user-data"
            element={<PrivateRoute component={UserData} />}
          />
          <Route path="/crc" element={<PrivateRoute component={CRC} />} />
          <Route
            path="/sendNoti"
            element={<PrivateRoute component={sendNoti} />}
          />
          <Route
            path="/quizForm"
            element={<PrivateRoute component={Quizform} />}
          />
          <Route
            path="/referrer_stats"
            element={<PrivateRoute component={ReferrerStatsPage} />}
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
