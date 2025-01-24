import React, { useState } from "react";
import { updateUserReferralCode } from "../api/userRef";

const ChangeReferralCodePage: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [newReferralCode, setNewReferralCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await updateUserReferralCode(
        userId,
        newReferralCode.toLowerCase()
      );
      if (result.success) {
        setMessage(result.message);
        setUserId("");
        setNewReferralCode("");
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setMessage(
        `Error: ${
          error instanceof Error ? error.message : "An unknown error occurred"
        }`
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 rounded-3xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl" />

      <div className="relative">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Change User Referral Code
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="userId" className="block text-gray-200 font-medium">
              User ID:
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
              placeholder="Enter User ID"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="newReferralCode"
              className="block text-gray-200 font-medium"
            >
              New Referral Code:
            </label>
            <input
              type="text"
              id="newReferralCode"
              value={newReferralCode}
              onChange={(e) => setNewReferralCode(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
              placeholder="Enter New Referral Code"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 
              rounded-xl text-white font-medium shadow-lg hover:shadow-purple-500/25 
              transition-all duration-300 hover:opacity-90"
          >
            Update Code
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 p-4 rounded-xl backdrop-blur-sm border ${
              message.startsWith("Error")
                ? "bg-red-500/10 border-red-500/20 text-red-200"
                : "bg-green-500/10 border-green-500/20 text-green-200"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeReferralCodePage;
