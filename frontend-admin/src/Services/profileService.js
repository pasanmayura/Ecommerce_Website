import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/profile';

export const getProfile = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getProfile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.user;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateProfile = async (token, user) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/updateProfile`, user, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.user;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw new Error('Failed to update profile');
  }
};

export const deleteAccount = async (token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/deleteAccount`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw new Error('Failed to delete account');
  }
};

export const changePassword = async (token, passwords) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/changePassword`, passwords, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw new Error('Failed to change password');
  }
};