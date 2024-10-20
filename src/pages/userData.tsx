import React, { useState, useEffect } from 'react';
import { fetchProfiles, fetchFilteredProfiles } from '../api'; // Import the new function
import '../styles/userData.css'; // Import CSS for styling

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
  const [filterOptions, setFilterOptions] = useState<{ filter: string; value: string }[]>([]); // New state for dynamic filters
  const [itemsPerPage] = useState<number>(100);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const data = await fetchProfiles(page);
        setProfiles(data);
        setHasMore(data.length > 0);
      } catch (error) {
        console.error('Error loading profiles:', error);
      }
    };
    loadProfiles();
  }, [page]);

  useEffect(() => {
    const loadFilteredProfiles = async () => {
      try {
        const data = await fetchFilteredProfiles(page, filters); // Swap the order of arguments
        setProfiles(data);
        setHasMore(data.length > 0);
      } catch (error) {
        console.error('Error loading filtered profiles:', error);
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
    setFilterOptions([...filterOptions, { filter: '', value: '' }]); // Add a new filter option
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
    <div>
      <h2>Profiles</h2>
      <div>
        {filterOptions.map((option, index) => (
          <div key={index}>
            <select
              value={option.filter}
              onChange={(e) => {
                const newOptions = [...filterOptions];
                newOptions[index].filter = e.target.value;
                setFilterOptions(newOptions);
              }}
            >
              <option value="">Select Filter</option>
              <option value="id">ID</option>
              <option value="name">Name</option>
              <option value="referral_code">Referral Code</option>
              <option value="phone">Phone</option>
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
          </div>
        ))}
        <button onClick={addFilter}>Add Filter</button> {/* Button to add a new filter */}
        <button onClick={applyFilters}>Apply Filters</button> {/* Button to apply filters */}
      </div>
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
      <button onClick={() => setPage(page + 1)} disabled={!hasMore}>Next</button>
      <table className="profile-table">
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Name</th>
            <th>Referral Code</th>
            <th>Phone</th>
            <th>Image URL</th>
            <th>Push Token</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile, index) => (
            <tr key={profile.id}>
              <td>{(page - 1) * itemsPerPage + index + 1}</td>
              <td>{profile.id}</td>
              <td>{profile.name || 'N/A'}</td>
              <td>{profile.referral_code || 'N/A'}</td>
              <td>{profile.phone || 'N/A'}</td>
              <td>{profile.image_url || 'N/A'}</td>
              <td>{profile.push_token || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserData;
