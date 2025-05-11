export const addProducts = async (formData) => {
  try {
    const response = await fetch(`http://localhost:5000/products/addProducts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
      },
      body: formData
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.log('Response text:', responseText);
      throw new Error(responseText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return { message: 'There was an error adding the product. Please try again.' };
  }
};

export const getProducts = async () => {
  try {
    const response = await fetch('http://localhost:5000/products/getProducts', {
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

export const deleteProduct = async (BatchID) => {
  try {
    const response = await fetch(`http://localhost:5000/products/deleteProduct/${BatchID}`, {
      method: 'DELETE',
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
    return { message: 'There was an error deleting the product. Please try again.' };
  }
};

export const updateProduct = async (productID, productData) => {
  try {
    const response = await fetch(`http://localhost:5000/products/updateProduct/${productID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
      },
      body: JSON.stringify(productData), // Send the product data as JSON
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.log('Response text:', responseText);
      throw new Error(responseText);
    }

    return await response.json(); // Parse and return the JSON response
  } catch (error) {
    console.error('Error updating product:', error);
    return { message: 'There was an error updating the product. Please try again.' };
  }
};  

export const getAttributes = async () => {
  try {
    const response = await fetch('http://localhost:5000/products/getAttributes', {
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