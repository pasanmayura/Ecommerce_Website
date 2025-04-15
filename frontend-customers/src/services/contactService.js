import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/contact';

export const submitContactForm = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/submit`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Return the response data
  } catch (error) {
    console.error('Error submitting contact form:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'There was an error submitting the form.');
  }
};