export const addCategory = async (Category_Name) => {
  try {
    const response = await fetch(`http://localhost:5000/category/addCategory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
      },
      body: JSON.stringify({ Category_Name })
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.log('Response text:', responseText);
      throw new Error(responseText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return { message: 'There was an error adding the category. Please try again.' };
  }
};

export const getCategories = async () => {
  try {
    const response = await fetch('http://localhost:5000/category/getCategories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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

export const deleteCategory = async (CategoryID) => {
  try {
    const response = await fetch(`http://localhost:5000/category/deleteCategory/${CategoryID}`, {
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
    return { message: 'Category Can not be deleted with Products. Delete products first.' };
  }
};

export const updateCategory = async (CategoryID, Category_Name) => {
  try {
    const response = await fetch(`http://localhost:5000/category/updateCategory/${CategoryID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
      },
      body: JSON.stringify({ Category_Name })
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.log('Response text:', responseText);
      throw new Error(responseText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return { message: 'There was an error updating the category. Please try again.' };
  }
};