import Cookies from 'js-cookie';

// Combined function to fetch profiles with optional filters
export const fetchProfiles = async (pageNumber: number, filters?: object): Promise<any> => { // Changed filters type from any[] to object
    try {
      console.log(filters)
      const apiUrl = `${process.env.REACT_APP_Server_URL}/admin/users/profiles?page=${pageNumber}`; // Updated to use environment variable and adjust URL based on filters
      const token = Cookies.get('token'); // Retrieve the token from cookies
      console.log('Fetching data from URL:', apiUrl); // Log the URL being used
      const response = await fetch(apiUrl, {
        method:  'POST' , // Use POST if filters are provided, otherwise GET
        headers: {
          ...(filters ? { 'Content-Type': 'application/json' } : {}), // Set content type to JSON if filters are present
          'Authorization': `Bearer ${token}`, // Include the Bearer token in the Authorization header
        },
        body: filters ? JSON.stringify({ filters }) : undefined, // Send filters in the body if present
      });
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

