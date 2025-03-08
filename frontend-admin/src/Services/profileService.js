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

  export const updateProfile = async (token, user) => {
    const response = await fetch('http://localhost:5000/api/profile/updateProfile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
  
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
  
    const data = await response.json();
    return data.user;
  };
  
  export const deleteAccount = async (token) => {
    const response = await fetch('http://localhost:5000/api/profile/deleteAccount', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  
    if (!response.ok) {
      throw new Error('Failed to delete account');
    }
  
    const data = await response.json();
    return data;
  };