import React, { useState, useEffect } from 'react';
import { fetchReferredCountByDate, fetchPurchaseCount, fetchDeletedCount } from '../api/referrer_stats';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles//ReferrerStatsPage.css';

interface ReferredCountByDate {
  referrer_user_id: string;
  referral_date: string;
  referred_count: number;
}

interface PurchaseCount {
  referrer_user_id: string;
  reward_title: string;
  purchase_count: number;
}

interface ReferrerStats {
  referredCountByDate: ReferredCountByDate[];
  purchaseCount: PurchaseCount[];
  deletedCount: number;
}

const ReferrerStatsPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [stats, setStats] = useState<ReferrerStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const referredCountByDate = await fetchReferredCountByDate(username);
      const purchaseCount = await fetchPurchaseCount(username);
      const deletedCount = await fetchDeletedCount(username);

      setStats({
        referredCountByDate,
        purchaseCount,
        deletedCount,
      });
    } catch (err) {
      console.error('Error fetching referrer stats:', err);
      setError('Failed to load referrer stats.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchStats();
    }
  }, [username]);

  const calculateTotalReferrals = () => {
    return stats?.referredCountByDate.reduce((total, item) => total + item.referred_count, 0) || 0;
  };

  return (
    <div className="referrer-stats-page">
      <h2>Referrer Stats</h2>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="username-input"
      />
      <button onClick={fetchStats} disabled={isLoading || !username} className="fetch-button">
        {isLoading ? 'Loading...' : 'Fetch Stats'}
      </button>
      {error && <p className="error-message">{error}</p>}
      {stats && (
        <div className="stats-container">
          <h3>Statistics for {username}</h3>
          <p>Total Referrals: {calculateTotalReferrals()}</p>
          <h4>Referred Count by Date:</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.referredCountByDate}>
              <XAxis dataKey="referral_date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="referred_count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <h4>Purchase Count:</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.purchaseCount}>
              <XAxis dataKey="reward_title" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="purchase_count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
          <p>Deleted Count: {stats.deletedCount}</p>
        </div>
      )}
    </div>
  );
};

export default ReferrerStatsPage;