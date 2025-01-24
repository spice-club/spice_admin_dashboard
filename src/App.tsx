// src/App.tsx
import React from "react";
import {
  Link,
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css"; // Importing a CSS file for styles
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

        <nav className="relative mb-12 p-8 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl" />

          {!isAuthenticated ? (
            <div className="relative flex justify-center">
              <Link
                to="/login"
                className="relative px-8 py-4 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-2xl 
                  text-white font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="relative flex flex-wrap justify-center gap-4">
              {[
                { to: "/user-referrals", text: "User Referrals" },
                { to: "/user-data", text: "User Data" },
                { to: "/crc", text: "Change Referral Code" },
                { to: "/sendNoti", text: "Send Notification" },
                { to: "/quizForm", text: "Quiz Form" },
                { to: "/referrer_stats", text: "Referrer Stats" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-gray-100 rounded-xl 
                    hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 
                    transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-purple-500/10
                    hover:border-purple-500/50 font-medium text-center flex items-center justify-center"
                >
                  {link.text}
                </Link>
              ))}
              <button onClick={handleLogout} className="relative group">
                <div
                  className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-xl blur opacity-30 
                  group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
                />
                <div
                  className="relative px-8 py-3 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-xl 
                  text-white font-medium shadow-lg hover:shadow-purple-500/25"
                >
                  Logout
                </div>
              </button>
            </div>
          )}
        </nav>
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
