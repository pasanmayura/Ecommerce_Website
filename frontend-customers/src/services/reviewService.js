import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/reviews';

export const submitReview = async (reviewData) => {
    try {
      const token = sessionStorage.getItem('jwtToken'); // Retrieve the token from sessionStorage
      const response = await axios.post(`${API_BASE_URL}/addReview`, reviewData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting review:', error.response?.data || error.message);
      throw error;
    }
  };