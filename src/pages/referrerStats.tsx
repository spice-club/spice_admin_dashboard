import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  fetchDeletedCount,
  fetchPurchaseCount,
  fetchReferredCountByDate,
} from "../api/referrer_stats";
import "../styles//ReferrerStatsPage.css";

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
  const [username, setUsername] = useState<string>("");
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
      console.error("Error fetching referrer stats:", err);
      setError("Failed to load referrer stats.");
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
    return (
      stats?.referredCountByDate.reduce(
        (total, item) => total + item.referred_count,
        0
      ) || 0
    );
  };

  return (
    <div className="max-w-6xl mx-auto my-12 p-8 rounded-3xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl" />

      <div className="relative">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Referrer Stats
        </h2>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
              text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 
              focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
          />
          <button
            onClick={fetchStats}
            disabled={isLoading || !username}
            className="mt-4 w-full py-3 px-6 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 
              rounded-xl text-white font-medium shadow-lg hover:shadow-purple-500/25 
              transition-all duration-300 hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Fetch Stats"}
          </button>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200">
            {error}
          </div>
        )}

        {stats && (
          <div className="space-y-8">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-xl font-medium text-gray-200 mb-4">
                Statistics for {username}
              </h3>
              <p className="text-gray-300">
                Total Referrals: {calculateTotalReferrals()}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h4 className="text-lg font-medium text-gray-200 mb-4">
                Referred Count by Date
              </h4>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.referredCountByDate}>
                    <XAxis dataKey="referral_date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(30, 41, 59, 0.9)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "0.75rem",
                        color: "#e2e8f0",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="referred_count" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h4 className="text-lg font-medium text-gray-200 mb-4">
                Purchase Count
              </h4>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.purchaseCount}>
                    <XAxis dataKey="reward_title" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(30, 41, 59, 0.9)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "0.75rem",
                        color: "#e2e8f0",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="purchase_count" fill="#ec4899" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-gray-300">
                Deleted Count: {stats.deletedCount}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferrerStatsPage;
