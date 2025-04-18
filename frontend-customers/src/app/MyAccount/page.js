'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from "@/components/Header";
import Footer from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { Button, TextField } from "@mui/material";
import { submitContactForm } from '@/services/contactService';
import { getUserDetails } from '@/services/userService'; 
import AlertComponent from '@/components/AlertComponent';
import '@/styles/MyAccount.css';

const MyAccount = () => {
    const router = useRouter();
    const [user, setUser] = useState({
        FirstName: '',
        LastName: '',
        Email: '',
        MobileNumber: '',
        Street_No: '',
        Village: '',
        City: '',
        PostalCode: '',
      });
    
      const [alert, setAlert] = useState({ severity: '', title: '', message: '' });
      const [isAuthenticated, setIsAuthenticated] = useState(false);

      // Check if the user is logged in
        useEffect(() => {
            const token = sessionStorage.getItem('jwtToken'); // Check for token in sessionStorage
            if (!token) {
                router.push('/SignIn'); // Redirect to Sign In page if not logged in
            } else {
                setIsAuthenticated(true); // Set authentication status

                // Fetch user details
                getUserDetails()
                .then((data) => setUser(data))
                .catch((error) => console.error('Error fetching user details:', error.message));
        }
        }, [router]);

        if (!isAuthenticated) {
            return null; // Render nothing while checking authentication
        }

      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await submitContactForm(formData);
          setAlert({ severity: 'success', title: 'Success', message: response.message });
          setFormData({ name: '', email: '', phone: '', message: '' }); // Clear the form
        } catch (error) {          
          setAlert({ severity: 'error', title: 'Error', message: error.message });
        }
      };

      const closeAlert = () => {
        setAlert({ severity: '', title: '', message: '' });
    };

  return (
    <div className="myaccount-all">
      <Header isHomePage={true}/>
      <main className="main-myaccount-content">

        
        <div className="sidebar-section">
            <Sidebar />
        </div>
        

        <div className='user-form'>
            <center>
            <Stack direction="row" style={{ justifyContent: 'center', marginBottom: '5%'}}>
                <Avatar sx={{ bgcolor: '#0A2F6E', width: 70, height: 70 }}>
                {user.FirstName.charAt(0)}
                </Avatar>
            </Stack></center>
        <form onSubmit={handleSubmit}>
            <div className='user-details'>
                <div className='user-details-text'>
                    <TextField
                        label="First Name"
                        name="FirstName"
                        type="text"
                        variant="outlined"
                        fullWidth
                        value={user.FirstName}
                        onChange={(e) => setUser({ ...user, FirstName: e.target.value })}
                    />
                </div>
                <div className='user-details-text'>
                    <TextField
                        label="Last Name"
                        name="LastName"
                        type="text"
                        variant="outlined"
                        value={user.LastName}
                        onChange={(e) => setUser({ ...user, LastName: e.target.value })}
                    />
                </div>
            </div>

            <div className='user-details'>
                <div className='user-details-text'>
                    <TextField 
                        label="Email"
                        name="Email"
                        type="email"
                        variant="outlined"
                        value={user.Email}
                        onChange={(e) => setUser({ ...user, Email: e.target.value })}                 
                    />
                </div>
                <div className='user-details-text'>
                    <TextField 
                        label="Phone Number"
                        name="MobileNumber"
                        type="text"
                        variant="outlined" 
                        value={user.MobileNumber}
                        onChange={(e) => setUser({ ...user, MobileNumber: e.target.value })}                
                    />
                </div>
            </div>

            <div className='user-details'>
                <div className='user-details-text'>
                    <TextField 
                        label="Street Number"
                        name="Street_No"
                        type="text"
                        variant="outlined"  
                        value={user.Street_No}
                        onChange={(e) => setUser({ ...user, Street_No: e.target.value })}               
                    />
                </div>
                <div className='user-details-text'>
                    <TextField 
                        label="Village"
                        name="Village"
                        type="text"
                        variant="outlined"
                        value={user.Village}
                        onChange={(e) => setUser({ ...user, Village: e.target.value })}                 
                    />
                </div>
            </div>

            <div className='user-details'>
                <div className='user-details-text'>
                    <TextField 
                        label="City"
                        name="City"
                        type="text"
                        variant="outlined" 
                        value={user.City}
                        onChange={(e) => setUser({ ...user, City: e.target.value })}                
                    />
                </div>
                <div className='user-details-text'>
                    <TextField 
                        label="Postal Code"
                        name="PostalCode"
                        type="text"
                        variant="outlined" 
                        value={user.PostalCode}
                        onChange={(e) => setUser({ ...user, PostalCode: e.target.value })}                
                    />
                </div>
            </div>
        
            <div className='myaccount-buttons'>
                <Button variant="contained" className="form-button" type="submit"> Edit </Button>  
                <Button variant="contained" className="form-button" type="submit"> Save Changes </Button>  
            </div>
        </form>         
        </div>         
        
        
      </main>  
      <Footer />
        {alert.message && (
            <AlertComponent
                severity={alert.severity}
                title={alert.title}
                message={alert.message}
                onClose={closeAlert}
                sx={{ width: '25%', position: 'fixed', top: '10%', left: '75%', zIndex: 9999 }}
            />
        )}
    </div>
  );
};

export default MyAccount;
