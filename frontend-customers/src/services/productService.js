import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/products';

export const getProductCards = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getProductCards`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Return the response data
  } catch (error) {
    console.error('Error Details:', error); // Log the full error object
    console.error('Error Response:', error.response); 
    console.error('Error:', error.response?.data || error.message); // Log the error details
    return []; // Return an empty array in case of an error
  }
};

export const searchProducts = async (searchQuery) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { query: searchQuery },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Return the search results
  } catch (error) {
    console.error('Error searching products:', error.response?.data || error.message);
    return []; // Return an empty array in case of an error
  }
};