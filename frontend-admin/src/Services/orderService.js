import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/order';

export const getOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getOrders`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return { message: 'There was an error getting the order details. Please try again.' };
  }
};

export const viewOrderbyId = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/viewOrderbyId/${id}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return { message: 'There was an error getting the order details. Please try again.' };
  }
};

export const updateOrderStatus = async (orderId, updatedOrderStatus, updatedPaymentStatus) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/updateOrderStatus/${orderId}`, {
      OrderStatus: updatedOrderStatus,
      PaymentStatus: updatedPaymentStatus,
    }, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return { message: 'There was an error updating the order status. Please try again.' };
  }
};

export const getOrderReturns = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getOrderReturns`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return { message: 'There was an error getting the order return details. Please try again.' };
  }
};

export const viewOrderReturnById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/viewOrderReturnById/${id}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return { message: 'There was an error getting the order return details. Please try again.' };
  }
};

export const updateOrderReturnStatus = async (orderReturnId, updatedReturnStatus) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/updateOrderReturnStatus/${orderReturnId}`, {
      ReturnStatus: updatedReturnStatus,
    }, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return { message: 'There was an error updating the order return status. Please try again.' };
  }
};
