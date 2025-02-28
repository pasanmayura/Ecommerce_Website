export const loginUser = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error);
      return { message: 'There was an error with the login. Please try again.' };
    }
  };
  
  export const registerUser = async (name, email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error);
      return { message: 'There was an error with the registration. Please try again.' };
    }
  };

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