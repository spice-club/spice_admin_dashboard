import Cookies from "js-cookie";

export const postQuiz = async ( quizData: object): Promise<any> => {
    try {
      const apiUrl = `${process.env.REACT_APP_Server_URL}/admin/quizForm/quiz`; // Store the URL in a variable

      console.log('Sending data from URL:', apiUrl); // Log the URL being used
      const token = Cookies.get('token'); // Retrieve the token from cooki
      const response = await fetch(apiUrl, {
        method: 'POST', // Specify the request method
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(quizData), // Convert the input JSON to a string
      });
      if (!response.ok) {
        throw new Error(`Error posting quiz data: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Received data:', data); // Updated to clarify the data received
      return data;
    } catch (error) {
      console.error('Error in postQuiz:', error);
      throw error;
    }
  };
  
