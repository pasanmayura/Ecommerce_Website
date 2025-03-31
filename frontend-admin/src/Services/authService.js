  export const loginAdmin = async (Email, Password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/loginAdmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email, Password })
      });
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error);
      return { message: 'There was an error with the login. Please try again.' };
    }
  };