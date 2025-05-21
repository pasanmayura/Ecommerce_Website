import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/employee';

export const getEmployee = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getEmployee`);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return [];
  }
};

export const registerEmp = async (FirstName, LastName, Email, PhoneNumber, Password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/registerEmp`, {
      FirstName,
      LastName,
      Email,
      PhoneNumber,
      Password,
    }, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    // Return the backend error response if available
    if (error.response && error.response.data) {
      return error.response.data;
    }
    // Return a generic error message if no backend response is available
    return { message: 'There was an error with the registration. Please try again.' };
  }
};