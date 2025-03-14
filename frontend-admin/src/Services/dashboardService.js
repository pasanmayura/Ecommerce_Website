export const getDashboardDetails = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/dashboard/getDashboardDetails', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
      },
    });
    if (!response.ok) {
      const responseText = await response.text();
      console.log('Response text:', responseText);
      throw new Error(responseText);
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return {};
  }
};

export const getLowStockProducts = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/dashboard/getLowStockProducts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
      },
    });
    if (!response.ok) {
      const responseText = await response.text();
      console.log('Response text:', responseText);
      throw new Error(responseText);
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const getSalesChart = async (period) => {
  try {
    const response = await fetch(`http://localhost:5000/api/dashboard/getSalesChart?period=${period}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
      },
    });
    if (!response.ok) {
      const responseText = await response.text();
      console.log('Response text:', responseText);
      throw new Error(responseText);
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};
