import Cookies from 'js-cookie';

const serverUrl = process.env.REACT_APP_Server_URL; // Ensure this environment variable is set

// Function to fetch referred count
export const fetchReferredCount = async (username: string): Promise<any> => {
  try {
    const apiUrl = `${serverUrl}/admin/stats/referral-stats/${username}/referred-count`;
    const token = Cookies.get('token');
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching referred count: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in fetchReferredCount:', error);
    throw error;
  }
};

// Function to fetch purchase count
export const fetchPurchaseCount = async (username: string): Promise<any> => {
  try {
    const apiUrl = `${serverUrl}/admin/stats/referral-stats/${username}/purchase-count`;
    const token = Cookies.get('token');
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching purchase count: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in fetchPurchaseCount:', error);
    throw error;
  }
};

// Function to fetch deleted count
export const fetchDeletedCount = async (username: string): Promise<any> => {
  try {
    const apiUrl = `${serverUrl}/admin/stats/referral-stats/${username}/deleted-count`;
    const token = Cookies.get('token');
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching deleted count: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in fetchDeletedCount:', error);
    throw error;
  }
};

// Function to fetch referred count by date
export const fetchReferredCountByDate = async (username: string): Promise<any> => {
  try {
    const apiUrl = `${serverUrl}/admin/stats/referral-stats/${username}/referred-count-by-date`;
    const token = Cookies.get('token');
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching referred count by date: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in fetchReferredCountByDate:', error);
    throw error;
  }
};