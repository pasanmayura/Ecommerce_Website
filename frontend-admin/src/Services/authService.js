import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/auth';

export const loginAdmin = async (Email, Password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/loginAdmin`, {
      Email,
      Password,
    });

    return response.data; // Return the response data
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return { message: 'There was an error with the login. Please try again.' };
  }
};