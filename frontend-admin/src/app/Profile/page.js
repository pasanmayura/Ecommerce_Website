'use client';

import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { getProfile } from '@/Services/profileService';
import "@/styles/Register.css"; 
import "@/styles/MostSold.css";
import "@/styles/Structure.css";

const Profile = () => {
  const [user, setUser] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    PhoneNumber: '',
    Role: ''
  });

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

  return (
    <div className="common">
      <Header />
      <main className="main-content">
        <div className="sidebar-section">
          <Sidebar />
        </div>

        <div className="content">
          
          <div className="Profile-Section">
           
            <div className="Profile-Details" style={{maxWidth: '500px', marginLeft: '8%', marginTop: '5%'}}>
            <h1>Profile</h1>

            <div className="Profile-icon-wrapper">
              <Stack direction="row" spacing={2} marginLeft={25} marginBottom={5}>
                <Avatar sx={{ bgcolor: '#0A2F6E', width: 70, height: 70 }}>{user.FirstName.charAt(0)}</Avatar>
              </Stack>
            </div>

              <TextField
                label="First Name"
                value={user.FirstName}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Last Name"
                value={user.LastName}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Email"
                value={user.Email}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Phone Number"
                value={user.PhoneNumber}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Role"
                value={user.Role}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>              
          </div>
        </div>
      </main>  
    </div>
  );
};

export default Profile;
