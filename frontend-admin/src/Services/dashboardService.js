import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/dashboard';

export const getDashboardDetails = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getDashboardDetails`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return {};
  }
};

export const getLowStockProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getLowStockProducts`, {
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

export const getSalesChart = async (period) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getSalesChart`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
      },
      params: { period }, // Pass the period as a query parameter
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return [];
  }
};
