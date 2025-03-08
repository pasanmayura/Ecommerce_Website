export const getProfile = async (token) => {
    try {
      console.log("Fetching profile with token:", token);
      const response = await fetch('http://localhost:5000/api/profile/getProfile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch profile: ${errorData.message}`);
      }
  
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  