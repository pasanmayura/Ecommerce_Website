import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/wishlist';

// Add a product to the wishlist
export const addToWishlist = async (productId) => {
  const token = sessionStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('No token found. Please log in.');
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/add`,
      { productId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding product to wishlist:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to add product to wishlist');
  }
};

// Remove a product from the wishlist
export const removeFromWishlist = async (productId) => {
  const token = sessionStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('No token found. Please log in.');
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/remove`,
      { productId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error removing product from wishlist:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to remove product from wishlist');
  }
};

// Fetch the wishlist for a specific user
export const getWishlist = async () => {
  const token = sessionStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('No token found. Please log in.');
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/getWishlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return an array of ProductIDs
  } catch (error) {
    console.error('Error fetching wishlist:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch wishlist');
  }
};

// Clear all items from the wishlist
export const clearWishlist = async () => {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('No token found. Please log in.');
    }
  
    try {
      const response = await axios.delete(`${API_BASE_URL}/clear`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error clearing wishlist:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to clear wishlist');
    }
  };