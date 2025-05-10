export const addBatch = async (batchData) => {
  try {
    const response = await fetch('http://localhost:5000/batch/addBatch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
      },
      body: JSON.stringify(batchData)
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.log('Response text:', responseText);
      throw new Error(responseText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return { message: 'There was an error adding the batch. Please try again.' };
  }
};

export const getProductsID = async () => {
  try {
    const response = await fetch('http://localhost:5000/batch/getProductsID', {
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

export const getProductAttributes = async (productID) => {
  try {
    const response = await fetch(`http://localhost:5000/batch/product-attributes/${productID}`, { // Corrected URL
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // Parse JSON response
    return data;
  } catch (error) {
    console.error('Error fetching product attributes:', error);
    return []; // Return an empty array in case of an error
  }
};