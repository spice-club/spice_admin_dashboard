import Cookies from "js-cookie";
const token=Cookies.get('token')
// Function to send notification to a single user
export const sendNotificationToSingleUser = async (userId: string, title: string, body: string) => {
  console.log(`Attempting to send notification to user ${userId}`);

  try {
    const response = await fetch(`${process.env.REACT_APP_Server_URL}/admin/notification/notify/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, body }),
    });

    console.log(`Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      throw new Error(`Failed to send notification: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Notification sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error in sendNotificationToSingleUser:', error);
    throw error;
  }
};

// Function to send notifications to a list of users
export const sendNotificationToUserList = async (userIds: string[], title: string, body: string) => {
  console.log(`Attempting to send notifications to ${userIds.length} users`);
  try {
    const response = await fetch(`${process.env.REACT_APP_Server_URL}/admin/notification/notify/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userIds, title, body }),
    });

    console.log(`Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      throw new Error(`Failed to send notifications: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Notifications sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error in sendNotificationToUserList:', error);
    throw error;
  }
};

// Function to send notification to all users
export const sendNotificationToAllUsers = async (title: string, body: string) => {
  console.log('Attempting to send notification to all users');
  try {
    const response = await fetch(`${process.env.REACT_APP_Server_URL}/admin/notification/notify/all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, body }),
    });

    console.log(`Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      throw new Error(`Failed to send notification to all users: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Notification sent to all users successfully:', result);
    return result;
  } catch (error) {
    console.error('Error in sendNotificationToAllUsers:', error);
    throw error;
  }
};

// Group all notification functions
export const notificationOperations = {
  sendToSingleUser: sendNotificationToSingleUser,
  sendToUserList: sendNotificationToUserList,
  sendToAllUsers: sendNotificationToAllUsers,
};

export default notificationOperations;
