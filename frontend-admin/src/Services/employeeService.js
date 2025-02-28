export const getEmployee = async () => {
    try {
      const response = await fetch('http://localhost:5000/employee/getEmployee', {
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

  export const registerEmp = async (FirstName, LastName, Email, PhoneNumber, Password) => {
    try {
      const response = await fetch('http://localhost:5000/employee/registerEmp', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}` // Ensure the token is included
        },
        body: JSON.stringify({ FirstName, LastName, Email, PhoneNumber, Password })
      });
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error);
      return { message: 'There was an error with the registration. Please try again.' };
    }
  };