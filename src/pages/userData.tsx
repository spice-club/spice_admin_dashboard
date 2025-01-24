import React, { useEffect, useState } from "react";
import { fetchProfiles } from "../api"; // Import the new function
import "../styles/userData.css"; // Import CSS for styling

interface Profile {
  id: string;
  name: string;
  referral_code: string;
  user_details: object;
  image_url: string;
  push_token: string;
  phone: string;
}

const UserData: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [filters, setFilters] = useState<{ [key: string]: string }>({}); // New state for filters
  const [filterOptions, setFilterOptions] = useState<
    { filter: string; value: string }[]
  >([]); // New state for dynamic filters
  const [itemsPerPage] = useState<number>(100);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const data = await fetchProfiles(page);
        setProfiles(data);
        setHasMore(data.length > 0);
      } catch (error) {
        console.error("Error loading profiles:", error);
      }
    };
    loadProfiles();
  }, [page]);

  useEffect(() => {
    const loadFilteredProfiles = async () => {
      try {
        const data = await fetchProfiles(page, filters); // Swap the order of arguments
        setProfiles(data);
        setHasMore(data.length > 0);
      } catch (error) {
        console.error("Error loading filtered profiles:", error);
      }
    };
    if (Object.keys(filters).length > 0) {
      loadFilteredProfiles(); // Load filtered profiles if filters are applied
    }
  }, [filters, page]); // Add page as a dependency

  const handleFilterChange = (filter: string, value: string) => {
    setFilters({ ...filters, [filter]: value }); // Update filters object
  };

  const addFilter = () => {
    setFilterOptions([...filterOptions, { filter: "", value: "" }]); // Add a new filter option
  };

  const applyFilters = () => {
    const newFilters = filterOptions.reduce((acc, curr) => {
      if (curr.filter && curr.value) {
        acc[curr.filter] = curr.value; // Build the filters object
      }
      return acc;
    }, {} as { [key: string]: string });
    setFilters(newFilters); // Update filters state
  };

  return (
    <div className="max-w-[90rem] mx-auto my-4 sm:my-12 p-4 sm:p-8 rounded-3xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl" />

      <div className="relative">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-8 text-center">
          <span
            className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent 
            drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
          >
            User Profiles
          </span>
        </h2>

        <div className="mb-4 sm:mb-8 space-y-3 sm:space-y-4">
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
                <option value="id">ID</option>
                <option value="name">Name</option>
                <option value="referral_code">Referral Code</option>
                <option value="phone">Phone</option>
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

        <div className="overflow-x-auto rounded-xl bg-slate-900/80 border border-white/10 shadow-xl -mx-4 sm:mx-0">
          <div className="min-w-[800px] sm:min-w-[1200px]">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/20 bg-slate-800/90">
                  <th className="sticky top-0 px-6 py-5 text-left text-sm font-semibold text-black">
                    #
                  </th>
                  <th className="sticky top-0 px-6 py-5 text-left text-sm font-semibold text-black min-w-[200px]">
                    ID
                  </th>
                  <th className="sticky top-0 px-6 py-5 text-left text-sm font-semibold text-black min-w-[150px]">
                    Name
                  </th>
                  <th className="sticky top-0 px-6 py-5 text-left text-sm font-semibold text-black min-w-[150px]">
                    Referral Code
                  </th>
                  <th className="sticky top-0 px-6 py-5 text-left text-sm font-semibold text-black min-w-[150px]">
                    Phone
                  </th>
                  <th className="sticky top-0 px-6 py-5 text-left text-sm font-semibold text-black min-w-[300px]">
                    Image URL
                  </th>
                  <th className="sticky top-0 px-6 py-5 text-left text-sm font-semibold text-black min-w-[300px]">
                    Push Token
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {profiles.map((profile, index) => (
                  <tr
                    key={profile.id}
                    className="hover:bg-slate-800/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-sm text-white">
                      {(page - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-mono">
                      {profile.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-medium">
                      {profile.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {profile.referral_code || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {profile.phone || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-white truncate font-mono">
                      {profile.image_url || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-white truncate font-mono">
                      {profile.push_token || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-200 
              hover:bg-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={!hasMore}
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

export default UserData;
