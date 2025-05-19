import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/category';

export const addCategory = async (Category_Name) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/addCategory`, { Category_Name }, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return { message: 'There was an error adding the category. Please try again.' };
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getCategories`);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return [];
  }
};

export const deleteCategory = async (CategoryID) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/deleteCategory/${CategoryID}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return { message: 'Category cannot be deleted with products. Delete products first.' };
  }
};

export const updateCategory = async (CategoryID, Category_Name) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/updateCategory/${CategoryID}`, { Category_Name }, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return { message: 'There was an error updating the category. Please try again.' };
  }
};