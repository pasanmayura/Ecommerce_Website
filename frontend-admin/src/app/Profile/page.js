'use client';

import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { getProfile } from '@/Services/profileService';
import "@/styles/Profile.css";

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
    <div className="Profile-page">
      <Header />
      <main className="Profile-main-content">
        <div className="Profile-sidebar-section">
          <Sidebar />
        </div>

        <div className="Profile-content">
          <div className="Profile-Section">
            <div className="Profile-Details">
              <h1 className="page-title">Profile</h1>
              <div className="Profile-icon-wrapper">
                <Avatar sx={{ bgcolor: '#0A2F6E' }}>
                  {user.FirstName ? user.FirstName.charAt(0) : ''}
                </Avatar>
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