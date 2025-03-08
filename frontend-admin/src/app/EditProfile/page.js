'use client';

import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile, updateProfile, deleteAccount } from '@/Services/profileService';
import AlertComponent from '@/components/AlertComponent';
import "@/styles/Register.css"; 
import "@/styles/MostSold.css";
import "@/styles/Structure.css";

const EditProfile = () => {
  const [user, setUser] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    PhoneNumber: '',
    Role: ''
  });
  const router = useRouter();
  const [alert, setAlert] = useState({ severity: '', title: '', message: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem('jwtToken');
        if (!token) {
          console.error("No token found in sessionStorage");
          return;
        }
        const userProfile = await getProfile(token);
        setUser(userProfile);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      await updateProfile(token, user);
      setAlert({ severity: 'success', title: 'Success', message: 'Profile updated successfully' });
      setTimeout(() => {
        router.push('/Profile'); 
      }, 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setAlert({ severity: 'error', title: 'Error', message: 'Failed to update profile' });
    }
  };

  const handleDelete = async () => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      await deleteAccount(token);
      setAlert({ severity: 'success', title: 'Success', message: 'Account deleted successfully' });
      router.push('/LoginAdmin');
    } catch (error) {
      console.error('Failed to delete account:', error);
      setAlert({ severity: 'error', title: 'Error', message: 'Failed to delete account' });
    }
  };

  const closeAlert = () => {
    setAlert({ severity: '', title: '', message: '' });
  };

  return (
    <div className="common">
      <Header />
      <main className="main-content">
        <div className="sidebar-section">
          <Sidebar />
        </div>

        <div className="content">
          <h1></h1>
          <div className="Profile-Section">
            <div className="Profile-icon-wrapper">
              <Stack direction="row" spacing={2} marginLeft={50}>
                <Avatar sx={{ bgcolor: '#0A2F6E', width: 70, height: 70 }}>{user.FirstName.charAt(0)}</Avatar>
              </Stack>
            </div>
            <div className="Profile-Details" style={{maxWidth: '500px', marginLeft: '15%', marginTop: '5%'}}>
              <TextField
                label="First Name"
                name="FirstName"
                value={user.FirstName}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Last Name"
                name="LastName"
                value={user.LastName}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                name="Email"
                value={user.Email}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Phone Number"
                name="PhoneNumber"
                value={user.PhoneNumber}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Role"
                name="Role"
                value={user.Role}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                    readOnly: true,
                  }}
              />
              <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: '20px', backgroundColor: '#0A2F6E' }}>
                Save Changes
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete} style={{ marginTop: '20px', marginLeft: '10px' }}>
                Delete Account
              </Button>
            </div>              
          </div>
        </div>
        {alert.message && (
          <AlertComponent
              severity={alert.severity}
              title={alert.title}
              message={alert.message}
              onClose={closeAlert}
              sx={{ width: '25%', position: 'fixed', top: '10%', left: '75%', zIndex: 9999 }}
          />
        )}
      </main>  
    </div>
  );
};

export default EditProfile;
