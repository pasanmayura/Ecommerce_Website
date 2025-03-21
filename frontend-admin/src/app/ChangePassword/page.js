'use client';

import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { changePassword } from '@/Services/profileService';
import AlertComponent from '@/components/AlertComponent';
import "@/styles/Register.css"; 
import "@/styles/MostSold.css";
import "@/styles/Structure.css";

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const router = useRouter();
  const [alert, setAlert] = useState({ severity: '', title: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setAlert({ severity: 'error', title: 'Error', message: 'New password and confirm password do not match' });
      return;
    }

    try {
      const token = sessionStorage.getItem('jwtToken');
      await changePassword(token, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      setAlert({ severity: 'success', title: 'Success', message: 'Password changed successfully' });
      setTimeout(() => {
        router.push('/Profile'); 
      }, 3000);
    } catch (error) {
      setAlert({ severity: 'error', title: 'Error', message: error.message });
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
          
          <div className="Profile-Section">          
            
            <div className="Profile-Details" style={{maxWidth: '500px', marginLeft: '8%', marginTop: '10%'}}>
            <h1>Change Password</h1>
              <TextField
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwords.currentPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="New Password"
                name="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwords.confirmPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '20px', backgroundColor: '#0A2F6E' }}>
                Change Password
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

export default ChangePassword;
