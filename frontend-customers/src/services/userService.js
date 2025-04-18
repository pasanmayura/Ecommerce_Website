import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/users';

export const getUserDetails = async () => {
  try {
    const token = sessionStorage.getItem('jwtToken'); // Get the token from sessionStorage
    const response = await axios.get(`${API_BASE_URL}/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    return response.data; // Return the user details
  } catch (error) {
    console.error('Error fetching user details:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch user details');
  }
};

export const updateUserDetails = async (userDetails) => {
  try {
    const token = sessionStorage.getItem('jwtToken'); // Get the token from sessionStorage
    const response = await axios.put(`${API_BASE_URL}/me`, userDetails, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    return response.data; // Return the updated user details
  } catch (error) {
    console.error('Error updating user details:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update user details');
  }
};