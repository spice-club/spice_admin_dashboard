import React, { useState } from 'react';
import { updateUserReferralCode } from '../api/userRef';

const ChangeReferralCodePage: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [newReferralCode, setNewReferralCode] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await updateUserReferralCode(userId, newReferralCode.toLowerCase());
      if (result.success) {
        setMessage(result.message);
        setUserId('');
        setNewReferralCode('');
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Change User Referral Code</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="userId" style={styles.label}>User ID:</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            style={styles.input}
            placeholder="Enter User ID"
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="newReferralCode" style={styles.label}>New Referral Code:</label>
          <input
            type="text"
            id="newReferralCode"
            value={newReferralCode}
            onChange={(e) => setNewReferralCode(e.target.value)}
            required
            style={styles.input}
            placeholder="Enter New Referral Code"
          />
        </div>
        <button type="submit" style={styles.button}>Enter</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 600,
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
  },
  button: {
    padding: '10px 15px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '20px',
    fontWeight: 500,
    color: '#333',
  },
};

export default ChangeReferralCodePage;
