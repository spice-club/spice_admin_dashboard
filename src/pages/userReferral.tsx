import React, { useState, useEffect } from 'react';
import { fetchUserRefs } from '../api/userRef'; // Import the new fetch functions

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
  const [filterOptions, setFilterOptions] = useState<{ filter: string; value: string }[]>([]);
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
        console.error('Error loading user referrals:', err);
        setError('Failed to load user referrals.');
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
    setFilterOptions([...filterOptions, { filter: '', value: '' }]);
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
    <div>
      <h2>User Referrals</h2>

      {/* Filter Section */}
      <div className="filter-section">
        {filterOptions.map((option, index) => (
          <div key={index} className="filter-option">
            <select
              value={option.filter}
              onChange={(e) => {
                const newOptions = [...filterOptions];
                newOptions[index].filter = e.target.value;
                setFilterOptions(newOptions);
              }}
            >
              <option value="">Select Filter</option>
              <option value="referrer_name">Referrer Name</option>
              <option value="referee_name">Referee Name</option>
              <option value="referrer_user_id">Referrer User ID</option>
              <option value="referee_user_id">Referee User ID</option>
              {/* Add more filter options as necessary */}
            </select>
            <input
              type="text"
              placeholder="Value"
              value={option.value}
              onChange={(e) => {
                const newOptions = [...filterOptions];
                newOptions[index].value = e.target.value;
                setFilterOptions(newOptions);
              }}
            />
            <button onClick={() => removeFilter(index)} className="remove-filter-button">
              ×
            </button>
          </div>
        ))}
        <button onClick={addFilter} className="add-filter-button">
          Add Filter
        </button>
        <button onClick={applyFilters} className="apply-filters-button">
          Apply Filters
        </button>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 1 || isLoading}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="current-page">Page {pageNumber}</span>
        <button
          onClick={() => handlePageChange(pageNumber + 1)}
          disabled={!hasMore || isLoading}
          className="pagination-button"
        >
          Next
        </button>
      </div>

      {/* Loading and Error Messages */}
      {isLoading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Referrals Table */}
      <table className="referrals-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Referrer User ID</th>
            <th>Referrer Name</th>
            <th>Referee User ID</th>
            <th>Referee Name</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {userRefs.length > 0 ? (
            userRefs.map((userRef, index) => (
              <tr key={`${userRef.referrer_user_id}-${userRef.referee_user_id}`}>
                <td>{index + 1 + (pageNumber - 1) * 100}</td>
                <td>{userRef.referrer_user_id}</td>
                <td>{userRef.referrer_name}</td>
                <td>{userRef.referee_user_id}</td>
                <td>{userRef.referee_name}</td>
                <td>{new Date(userRef.created_at).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No referrals found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserReferrals;
