import React, { useEffect, useState } from "react";
import { fetchUserRefs } from "../api/userRef"; // Import the new fetch functions

interface UserRef {
  referrer_user_id: number;
  referrer_name: string;
  referee_user_id: number;
  referee_name: string;
  created_at: string;
}

const UserReferrals: React.FC = () => {
  const [userRefs, setUserRefs] = useState<UserRef[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [filterOptions, setFilterOptions] = useState<
    { filter: string; value: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user references when page or filters change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let data: UserRef[];
        if (Object.keys(filters).length > 0) {
          data = await fetchUserRefs(pageNumber, filters); // Fetch filtered data
        } else {
          data = await fetchUserRefs(pageNumber); // Fetch user references
        }
        setUserRefs(data); // Set userRefs to the new data for the current page
        setHasMore(data.length > 0); // Update hasMore based on fetched data
      } catch (err) {
        console.error("Error loading user referrals:", err);
        setError("Failed to load user referrals.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [pageNumber, filters]);

  const handleFilterChange = (filter: string, value: string) => {
    setFilters({ ...filters, [filter]: value });
  };

  const addFilter = () => {
    setFilterOptions([...filterOptions, { filter: "", value: "" }]);
  };

  const applyFilters = () => {
    const newFilters = filterOptions.reduce((acc, curr) => {
      if (curr.filter && curr.value) {
        acc[curr.filter] = curr.value;
      }
      return acc;
    }, {} as { [key: string]: string });
    setFilters(newFilters);
    setPageNumber(1); // Reset to first page when applying new filters
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setPageNumber(newPage);
  };

  const removeFilter = (index: number) => {
    const newFilterOptions = [...filterOptions];
    newFilterOptions.splice(index, 1);
    setFilterOptions(newFilterOptions);
  };

  return (
    <div className="max-w-[90rem] mx-auto my-12 p-8 rounded-3xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl" />

      <div className="relative">
        <h2 className="text-4xl font-bold mb-8 text-center">
          <span
            className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent 
            drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
          >
            User Referrals
          </span>
        </h2>

        {/* Filter Section */}
        <div className="mb-8 space-y-4">
          {filterOptions.map((option, index) => (
            <div key={index} className="flex gap-4">
              <select
                value={option.filter}
                onChange={(e) => {
                  const newOptions = [...filterOptions];
                  newOptions[index].filter = e.target.value;
                  setFilterOptions(newOptions);
                }}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                  text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                  focus:border-transparent transition-all duration-300"
              >
                <option value="">Select Filter</option>
                <option value="referrer_name">Referrer Name</option>
                <option value="referee_name">Referee Name</option>
                <option value="referrer_user_id">Referrer User ID</option>
                <option value="referee_user_id">Referee User ID</option>
              </select>
              <input
                type="text"
                placeholder="Filter value"
                value={option.value}
                onChange={(e) => {
                  const newOptions = [...filterOptions];
                  newOptions[index].value = e.target.value;
                  setFilterOptions(newOptions);
                }}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                  text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 
                  focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
              />
              <button
                onClick={() => removeFilter(index)}
                className="px-4 py-3 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 
                  transition-all duration-300"
              >
                ×
              </button>
            </div>
          ))}

          <div className="flex gap-4">
            <button
              onClick={addFilter}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-200 
                hover:bg-white/10 transition-all duration-300"
            >
              Add Filter
            </button>
            <button
              onClick={applyFilters}
              className="px-6 py-3 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 
                rounded-xl text-white font-medium shadow-lg hover:shadow-purple-500/25 
                transition-all duration-300 hover:opacity-90"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Loading and Error Messages */}
        {isLoading && (
          <div className="p-4 mb-6 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-200">
            Loading...
          </div>
        )}
        {error && (
          <div className="p-4 mb-6 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200">
            {error}
          </div>
        )}

        {/* Referrals Table */}
        <div className="overflow-x-auto rounded-xl bg-slate-900/80 border border-white/10 shadow-xl">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b border-white/20 bg-slate-800/90">
                <th className="sticky top-0 px-6 py-5 text-left text-sm font-semibold text-black min-w-[80px]">
                  No.
                </th>
                <th className="sticky top-0 px-6 py-5 text-left text-sm font-semibold text-black min-w-[200px]">
                  Referrer User ID
                </th>
                <th className="sticky top-0 px-6 py-5 text-left text-sm font-semibold text-black min-w-[200px]">
                  Referrer Name
                </th>
                <th className="sticky top-0 px-6 py-5 text-left text-sm font-semibold text-black min-w-[200px]">
                  Referee User ID
                </th>
                <th className="sticky top-0 px-6 py-5 text-left text-sm font-semibold text-black min-w-[200px]">
                  Referee Name
                </th>
                <th className="sticky top-0 px-6 py-5 text-left text-sm font-semibold text-black min-w-[200px]">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {userRefs.length > 0 ? (
                userRefs.map((userRef, index) => (
                  <tr
                    key={`${userRef.referrer_user_id}-${userRef.referee_user_id}`}
                    className="hover:bg-slate-800/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-sm text-white">
                      {index + 1 + (pageNumber - 1) * 100}
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-mono">
                      {userRef.referrer_user_id}
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-medium">
                      {userRef.referrer_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-mono">
                      {userRef.referee_user_id}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {userRef.referee_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {new Date(userRef.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No referrals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => handlePageChange(pageNumber - 1)}
            disabled={pageNumber === 1 || isLoading}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-200 
              hover:bg-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-200">
            Page {pageNumber}
          </span>
          <button
            onClick={() => handlePageChange(pageNumber + 1)}
            disabled={!hasMore || isLoading}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-200 
              hover:bg-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserReferrals;
