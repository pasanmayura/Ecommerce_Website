"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, TextField } from "@mui/material";
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { getCategories, updateCategory } from "@/Services/categoryService";
import AlertComponent from '@/components/AlertComponent';
import "@/styles/Structure.css"; 

const CategoryEdit = () => {
  const [CategoryID, setCategoryID] = useState('');
  const [Category_Name, setCategory_Name] = useState('');
  const [alert, setAlert] = useState({ severity: '', title: '', message: '' });
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchCategory = async () => {
      const id = searchParams.get('id');
      if (id) {
        const categories = await getCategories();
        const category = categories.find(cat => cat.CategoryID === id);
        if (category) {
          setCategoryID(category.CategoryID);
          setCategory_Name(category.Category_Name);
        }
      }
    };

    fetchCategory();
  }, [searchParams]);

  const handleCategoryName = (e) => {
    setCategory_Name(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Category_Name) {
      setAlert({ severity: 'error', title: 'Error', message: 'Category Name is required' });
    } else {
      setAlert('');
      const result = await updateCategory(CategoryID, Category_Name);
      if (result.message === 'Category updated successfully') {
        setAlert({ severity: 'success', title: 'Success', message: 'Category updated successfully' });
        setTimeout(() => {
          router.push('/CategoryList'); 
        }, 2000);
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
            <h1>Category Edit</h1>
            <div className="form-section">
              <form className="form" onSubmit={handleSubmit}>                  
                  <div className="form-group">
                    <TextField 
                      fullWidth 
                      label="Category ID" 
                      id="CategoryID" 
                      required 
                      value={CategoryID}
                      disabled
                    />
                  </div> 
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
                  <Button variant="contained" className="form-button" type="submit">Save Changes</Button>                            
              </form>
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
          </div>
      </main> 
    </div>
  );
};

export default CategoryEdit;
