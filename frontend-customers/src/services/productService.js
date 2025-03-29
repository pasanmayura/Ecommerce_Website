export const getProductCards = async () => {
    try {
      const response = await fetch('http://localhost:5000/products/getProductCards', {
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