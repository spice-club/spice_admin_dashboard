// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';
import UserReferrals from './pages/userReferral';
import UserData from './pages/userData';
import Login from './pages/login';
import sendNoti from './pages/sendNoti'
import CRC from './pages/crc'
import Quizform from './pages/makeQuiz'
import PrivateRoute from './components/privateRoute';
import './App.css'; // Importing a CSS file for styles

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ backgroundColor: '#f0f0f0', padding: '20px' }}>
        <h1 style={{ color: '#333', textAlign: 'center' }}>Admin Dashboard</h1>
        <nav style={{ marginBottom: '20px', textAlign: 'center' }}>
          <Link
            to="/login"
            style={{
              margin: '0 15px',
              color: '#2980b9',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '18px',
              borderRight: '2px solid black',
              paddingRight: '15px'
            }}
          >
            Login
          </Link>
          <Link
            to="/user-referrals"
            style={{
              margin: '0 15px',
              color: '#2980b9',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '18px',
              borderRight: '2px solid black',
              paddingRight: '15px'
            }}
          >
            User Referrals
          </Link>
          <Link
            to="/user-data"
            style={{
              margin: '0 15px',
              color: '#2980b9',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '18px',
              borderRight: '2px solid black',
              paddingRight: '15px'
            }}
          >
            User Data
          </Link>
          <Link
            to="/crc"
            style={{
              margin: '0 15px',
              color: '#2980b9',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '18px',
              borderRight: '2px solid black',
              paddingRight: '15px'
            }}
          >
            Change Referral Code
          </Link>
          <Link
            to="/sendNoti"
            style={{
              margin: '0 15px',
              color: '#2980b9',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '18px'
            }}
          >
            Send Notification
          </Link>
          <Link
            to="/quizForm"
            style={{
              margin: '0 15px',
              color: '#2980b9',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '18px',
              borderRight: '2px solid black',
              paddingRight: '15px'
            }}
          >
            Quiz Form
          </Link>
        </nav>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/user-referrals" element={<PrivateRoute component={UserReferrals} />} />
          <Route path="/user-data" element={<PrivateRoute component={UserData} />} />
          <Route path="/crc" element={<PrivateRoute component={CRC} />} />
          <Route path="/sendNoti" element={<PrivateRoute component={sendNoti} />} />
          <Route path="/quizForm" element={<PrivateRoute component={Quizform} />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
