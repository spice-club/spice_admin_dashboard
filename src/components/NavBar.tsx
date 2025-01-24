import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavBarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ isAuthenticated, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: "/user-referrals", text: "User Referrals" },
    { to: "/user-data", text: "User Data" },
    { to: "/crc", text: "Change Referral Code" },
    { to: "/sendNoti", text: "Send Notification" },
    { to: "/quizForm", text: "Quiz Form" },
    { to: "/referrer_stats", text: "Referrer Stats" },
  ];

  return (
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
        <div className="relative">
          {/* Hamburger Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden absolute right-0 top-0 p-2 text-white"
          >
            <div className="w-6 h-0.5 bg-white mb-1.5"></div>
            <div className="w-6 h-0.5 bg-white mb-1.5"></div>
            <div className="w-6 h-0.5 bg-white"></div>
          </button>

          {/* Navigation Links */}
          <div className={`
            ${isMenuOpen ? 'flex' : 'hidden'} 
            md:flex flex-col md:flex-row justify-center gap-4 
            md:flex-wrap mt-8 md:mt-0
          `}>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-6 py-3 bg-white/5 border border-white/10 text-gray-100 rounded-xl 
                  hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 
                  transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-purple-500/10
                  hover:border-purple-500/50 font-medium text-center flex items-center justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.text}
              </Link>
            ))}
            <button onClick={onLogout} className="relative group">
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
        </div>
      )}
    </nav>
  );
};

export default NavBar;