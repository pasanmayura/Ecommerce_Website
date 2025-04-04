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
  
  // Register User
export const registerUser = async (FirstName, LastName, Email, Password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      FirstName,
      LastName,
      Email,
      Password,
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return { success: false, message: 'There was an error with the registration.' };
  }
};

// Verify Email Code
export const verifyEmailCode = async (Email, Code, FirstName, LastName, Password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-email`, {
      Email,
      Code,
      FirstName,
      LastName,
      Password,
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return { success: false, message: 'There was an error verifying the email code.' };
  }
};