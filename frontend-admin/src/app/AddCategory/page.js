"use client";

import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { addCategory } from "@/Services/categoryService";
import AlertComponent from '@/components/AlertComponent'; 
import "@/styles/Structure.css"; 

const AddCategory = () => {
  const [Category_Name, setCategory_Name] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [alert, setAlert] = useState({ severity: '', title: '', message: '' });

  const handleCategoryName = (e) => {
    setCategory_Name(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Category_Name) {
      setErrorMessage('Category Name is required');
      setAlert({ severity: 'warning', title: 'Warning', message: 'Category Name is required' });
    } else {
      setErrorMessage('');
      const result = await addCategory(Category_Name);
      if (result.message === 'Category added successfully') {
        setAlert({ severity: 'success', title: 'Success', message: 'Category is Added' });
        setCategory_Name('');
      } else {
        setErrorMessage(result.message);
        setAlert({ severity: 'error', title: 'Error', message: result.message });
      }
    }
  }

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
            <h1>Add Category</h1>
            <div className="form-section">
              <form className="form" onSubmit={handleSubmit}>                  
                  <div className="form-group">
                    <TextField 
                      fullWidth 
                      label="Category Name" 
                      id="Category_Name" 
                      required 
                      value={Category_Name}
                      onChange={handleCategoryName}
                    />
                  </div>                 
                  <Button variant="contained" className="form-button" type="submit">Add Category</Button>                            
              </form>
              {errorMessage && <p className="error-message">{errorMessage}</p>} 
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

export default AddCategory; 
