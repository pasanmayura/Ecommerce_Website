'use client';

import React, { useState } from 'react';
import { Button, TextField } from "@mui/material";
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { registerEmp } from "@/Services/employeeService";
import AlertComponent from '@/components/AlertComponent';
import "@/styles/AddEmployee.css";

const AddEmployee = () => {
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        Email: '',
        PhoneNumber: '',
        Password: '',
        confirmPassword: ''
    });
    const [alert, setAlert] = useState({ severity: '', title: '', message: '' });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { FirstName, LastName, Email, PhoneNumber, Password, confirmPassword } = formData;
      
        if (Password !== confirmPassword) {
          setAlert({ severity: 'error', title: 'Error', message: 'Passwords do not match' });
          return;
        }
      
        setAlert({ severity: '', title: '', message: '' });
      
        try {
          const result = await registerEmp(FirstName, LastName, Email, PhoneNumber, Password);
      
          if (result.message === 'Employee registered successfully') {
            setAlert({ severity: 'success', title: 'Success', message: 'Employee added successfully' });
            // Clear the form
            setFormData({
              FirstName: '',
              LastName: '',
              Email: '',
              PhoneNumber: '',
              Password: '',
              confirmPassword: ''
            });
          } else if (result.message === 'Access denied. Only admins can register employees.') {
            // Show an alert if the user is not an admin
            setAlert({ severity: 'error', title: 'Access Denied', message: 'Only admins are allowed to add employees.' });
          } else {
            setAlert({ severity: 'error', title: 'Error', message: result.message });
          }
        } catch (error) {
          setAlert({
            severity: 'error',
            title: 'Error',
            message: error.message || 'Failed to register employee'
          });
        }
      };

    const closeAlert = () => {
        setAlert({ severity: '', title: '', message: '' });
    };
  
    return (
        <div className="add-employee">
            <Header />
            <main className="add-employee-main-content">
                <div className="add-employee-sidebar-section">
                    <Sidebar />
                </div>
    
                <div className="add-employee-content-section">
                    <div className="add-employee-page-header">
                        <h1 className='page-title'>Add Employee</h1>
                    </div>
                    
                    <div className="add-employee-form-container">                        
                        <form className="employee-form" onSubmit={handleSubmit}>
                            <div className="add-employee-form-group">
                                <TextField 
                                  fullWidth 
                                  label="First Name" 
                                  id="FirstName" 
                                  required 
                                  value={formData.FirstName} 
                                  onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="add-employee-form-group">
                                <TextField 
                                  fullWidth 
                                  label="Last Name" 
                                  id="LastName" 
                                  required 
                                  value={formData.LastName} 
                                  onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="add-employee-form-group">              
                                <TextField 
                                  fullWidth 
                                  label="Email" 
                                  id="Email" 
                                  type="email" 
                                  required 
                                  value={formData.Email} 
                                  onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="add-employee-form-group">
                                <TextField 
                                  fullWidth 
                                  label="Phone Number" 
                                  id="PhoneNumber" 
                                  required 
                                  value={formData.PhoneNumber} 
                                  onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="add-employee-form-group">
                                <TextField 
                                  fullWidth 
                                  label="Password" 
                                  id="Password" 
                                  type="password" 
                                  required 
                                  value={formData.Password} 
                                  onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="add-employee-form-group">
                                <TextField 
                                  fullWidth 
                                  label="Confirm Password" 
                                  id="confirmPassword" 
                                  type="password" 
                                  required 
                                  value={formData.confirmPassword} 
                                  onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="add-employee-form-actions">
                                <Button 
                                  variant="contained" 
                                  className="submit-button" 
                                  type="submit"
                                >
                                  Add Employee
                                </Button>
                            </div>                          
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
                sx={{ width: '25%', position: 'fixed', top: '10%', right: '2%', zIndex: 9999 }}
            />
            )}
        </div>
    );
};

export default AddEmployee;