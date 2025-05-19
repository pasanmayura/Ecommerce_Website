import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/products';

export const addProducts = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/addProducts`, formData, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return { message: 'There was an error adding the product. Please try again.' };
  }
};

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getProducts`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return [];
  }
};

export const deleteProduct = async (BatchID) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/deleteProduct/${BatchID}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return { message: 'There was an error deleting the product. Please try again.' };
  }
};

export const updateProduct = async (productID, productData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/updateProduct/${productID}`, productData, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error.response?.data || error.message);
    return { message: 'There was an error updating the product. Please try again.' };
  }
};

export const getAttributes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAttributes`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return [];
  }
};