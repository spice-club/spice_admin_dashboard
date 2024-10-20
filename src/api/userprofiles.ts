import Cookies from 'js-cookie';

export const fetchProfiles = async (pageNumber: number): Promise<any> => {
    try {
      const apiUrl = `${process.env.REACT_APP_Server_URL}/admin/users/profiles?page=${pageNumber}`; // Updated to use environment variable
      const token = Cookies.get('token'); // Retrieve the token from cookies
      console.log('Fetching data from URL:', apiUrl); // Log the URL being used
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the Bearer token in the Authorization header
        },
      }); // Updated to use the stored URL
      if (!response.ok) {
        throw new Error(`Error fetching profiles: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Received data:', data); // Updated to clarify the data received
      return data;
    } catch (error) {
      console.error('Error in fetchProfiles:', error);
      throw error;
    }
  };

// New function to fetch filtered profiles
export const fetchFilteredProfiles = async (pageNumber: number, filters: object): Promise<any> => { // Changed filters type from any[] to object
  try {
    console.log("Clicked")
    const apiUrl = `${process.env.REACT_APP_Server_URL}/admin/users/profilesF?page=${pageNumber}`; // Updated to use environment variable
    const token = Cookies.get('token'); // Retrieve the token from cookies
    const response = await fetch(apiUrl, {
      method: 'POST', // Set the method to POST
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
        'Authorization': `Bearer ${token}`, // Include the Bearer token in the Authorization header
      },
      body: JSON.stringify({ filters: filters }),
    });
    if (!response.ok) {
      throw new Error(`Error fetching filtered profiles: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Received filtered data:', data); // Log the received data
    return data;
  } catch (error) {
    console.error('Error in fetchFilteredProfiles:', error);
    throw error;
  }
};
