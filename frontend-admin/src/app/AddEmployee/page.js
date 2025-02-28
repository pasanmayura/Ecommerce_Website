'use client';

import React, { useState } from 'react';
import { Button, TextField } from "@mui/material";
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { registerEmp } from "@/Services/employeeService";

const AddEmployee = () => {
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [Email, setEmail] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [Password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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
            setErrorMessage('Passwords do not match');
            alert('Passwords do not match');
        } else {
            setErrorMessage('');
            const result = await registerEmp(FirstName, LastName, Email, PhoneNumber, Password);
            if (result.message === 'Employee registered successfully') {
                alert('Employee added successfully');
                // Clear the text fields
                setFirstName('');
                setLastName('');
                setEmail('');
                setPhoneNumber('');
                setPassword('');
                setConfirmPassword('');
            } else {
                alert(result.message);
            }
        }
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
                                {errorMessage && (<span className="error-message">Passwords do not match</span>)}
                            </div>
                            <Button variant="contained" className="form-button" type="submit">Add Employee</Button>                            
                        </form>
                    </div>
                </div>
            </main> 
        </div>
    );
};

export default AddEmployee;