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

export const getProductsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/category`, {
      params: { category },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Return the products
  } catch (error) {
    console.error('Error fetching products by category:', error.response?.data || error.message);
    return []; // Return an empty array in case of an error
  }
};

export const getProductDetails = async (productId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/details/${productId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Return the product details
  } catch (error) {
    console.error('Error fetching product details:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch product details');
  }
};