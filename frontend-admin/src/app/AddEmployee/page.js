'use client';

import React, { useState } from 'react';
import { Button, TextField } from "@mui/material";
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { registerEmp } from "@/Services/employeeService";
import AlertComponent from '@/components/AlertComponent';

const AddEmployee = () => {
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [Email, setEmail] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [Password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [alert, setAlert] = useState({ severity: '', title: '', message: '' });

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    }

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Password !== confirmPassword) {
            setAlert({ severity: 'error', title: 'Error', message: 'Passwords do not match' });
        } else {
            setAlert('');
            const result = await registerEmp(FirstName, LastName, Email, PhoneNumber, Password);
            if (result.message === 'Employee registered successfully') {
                setAlert({ severity: 'success', title: 'Success', message: 'Employee added successfully' });
                // Clear the text fields
                setFirstName('');
                setLastName('');
                setEmail('');
                setPhoneNumber('');
                setPassword('');
                setConfirmPassword('');
            } else {
                setAlert({ severity: 'error', title: 'Error', message: result.message });
            }
        }
    }

    const closeAlert = () => {
        setAlert({ severity: '', title: '', message: '' });
    }
  
    return (
        <div className="common">
            <Header />
            <main className="main-content">
                <div className="sidebar-section">
                    <Sidebar />
                </div>
    
                <div className="content">
                    <h1>Employee</h1>
                    <div className="form-section">
                        <p className="form-subtitle">Add Employee</p>
                        <form className="form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <TextField 
                                  fullWidth 
                                  label="First Name" 
                                  id="FirstName" 
                                  required 
                                  value={FirstName} 
                                  onChange={handleFirstNameChange} 
                                />
                            </div>
                            <div className="form-group">
                                <TextField 
                                  fullWidth 
                                  label="Last Name" 
                                  id="LastName" 
                                  required 
                                  value={LastName} 
                                  onChange={handleLastNameChange} 
                                />
                            </div>
                            <div className="form-group">              
                                <TextField 
                                  fullWidth 
                                  label="Email" 
                                  id="Email" 
                                  type="email" 
                                  required 
                                  value={Email} 
                                  onChange={handleEmailChange} 
                                />
                            </div>
                            <div className="form-group">
                                <TextField 
                                  fullWidth 
                                  label="Phone Number" 
                                  id="PhoneNumber" 
                                  required 
                                  value={PhoneNumber} 
                                  onChange={handlePhoneNumberChange} 
                                />
                            </div>
                            <div className="form-group">
                                <TextField 
                                  fullWidth 
                                  label="Password" 
                                  id="Password" 
                                  type="password" 
                                  required 
                                  value={Password} 
                                  onChange={handlePasswordChange} 
                                />
                            </div>
                            <div className="form-group">
                                <TextField 
                                  fullWidth 
                                  label="Confirm Password" 
                                  id="confirm_password" 
                                  type="password" 
                                  required 
                                  value={confirmPassword} 
                                  onChange={handleConfirmPasswordChange} 
                                />
                                {alert.message && (<AlertComponent severity={alert.severity} title={alert.title} message={alert.message} onClose={closeAlert} />)}
                            </div>
                            <Button variant="contained" className="form-button" type="submit">Add Employee</Button>                            
                        </form>
                    </div>
                </div>
            </main> 
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

export default AddEmployee;