import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/auth';

export const loginUser = async (Email, Password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      Email,
      Password
    });
  
    return response.data;
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    return { message: error.response?.data?.message ||  'There was an error with the login. Please try again.' };
    }
  };
  
  export const registerUser = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        name,
        email,
        password,
      });
  
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      return { message: 'There was an error with the registration. Please try again.' };
    }
  };