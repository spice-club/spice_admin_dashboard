// src/pages/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting

    try {
      const response = await fetch(`${process.env.REACT_APP_Server_URL}/public/admin_login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Send username and password
      });

      const data = await response.json(); // Parse the JSON response

      if (response.ok) {
        login(data.token); // Use the token from the response
        console.log(data.token)
        navigate('/user-referrals'); // Redirect after login
      } else {
        setError(data.message || 'Invalid credentials'); // Handle error message
      }
    } catch (error) {
      setError('An error occurred. Please try again.'); // Handle fetch error
    } finally {
      setLoading(false); // Reset loading state after processing
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>Login</button> {/* Disable button when loading */}
        {loading && <p>Loading...</p>} {/* Show loading message */}
      </form>
    </div>
  );
};

export default Login;
