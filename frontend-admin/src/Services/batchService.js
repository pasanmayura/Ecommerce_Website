import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/batch';

export const addBatch = async (batchData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/addBatch`, batchData, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return { message: 'There was an error adding the batch. Please try again.' };
  }
};

export const getProductsID = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getProductsID`, {
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

export const getProductAttributes = async (productID) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/product-attributes/${productID}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching product attributes:', error.response?.data || error.message);
    return [];
  }
};