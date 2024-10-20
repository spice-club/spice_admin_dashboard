import Cookies from "js-cookie";

// New function to fetch user references
export const fetchUserRefs = async (pageNumber: number): Promise<any> => {
  try {
    const apiUrl = `${process.env.REACT_APP_Server_URL}/admin/userRef/user-referrals?page=${pageNumber}`; // Updated to use environment variable
    const token = Cookies.get('token'); // Retrieve the token from cookies
    console.log('Fetching data from URL:', apiUrl); // Log the URL being used
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`, // Include the Bearer token in the Authorization header
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching user references: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Received data:', data); // Updated to clarify the data received
    return data;
  } catch (error) {
    console.error('Error in fetchUserRefs:', error);
    throw error;
  }
};

// New function to fetch filtered user references
export const fetchFilteredUserRefs = async (pageNumber: number, filters: object): Promise<any> => { // Changed filters type from any[] to object
  try {
    const apiUrl = `${process.env.REACT_APP_Server_URL}/admin/userRef/user-referralsF?page=${pageNumber}`; // Updated to use environment variable
    const token = Cookies.get('token'); // Retrieve the token from cookies
    const response = await fetch(apiUrl, {
      method: 'POST', // Set the method to POST
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
        'Authorization': `Bearer ${token}`, // Include the Bearer token in the Authorization header
      },
      body: JSON.stringify({ filters: filters }), // Pass filters directly as an object in the request body
    });
    if (!response.ok) {
      throw new Error(`Error fetching filtered user references: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Received filtered user references data:', data); // Log the received data
    return data;
  } catch (error) {
    console.error('Error in fetchFilteredUserRefs:', error);
    throw error;
  }
};

// New function to update user referral code
export const updateUserReferralCode = async (userId: string, newReferralCode: string): Promise<{ success: boolean, message: string }> => {
  try {
    const apiUrl = `${process.env.REACT_APP_Server_URL}/admin/userRef/update_ref`; // Updated to use environment variable
    const token = Cookies.get('token'); // Retrieve the token from cookies
  
    
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the Bearer token in the Authorization header
      },
      body: JSON.stringify({ userId, newReferralCode }),
    });

    console.log(`Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      throw new Error(`Error updating user referral code: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Referral code update response:', data);

    // Check if the response has a status property
    if (data && typeof data.status === 'string') {
      console.log(`Response status from server: ${data.status}`);
      if (data?.status === "success") {
        console.log('Referral code update successful');
        return { success: true, message: "Referral code updated successfully" };
      } else {
        console.warn(`Referral code update failed with status: ${data.status}`);
        return { success: false, message: `Failed to update referral code: ${data.status}` };
      }
    } else {
      // If there's no status property, assume success if the response is ok
      console.log('No status property in response, assuming success');
      return { success: true, message: "Referral code update completed" };
    }
  } catch (error) {
    console.error('Error in updateUserReferralCode:', error);
    return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
};
