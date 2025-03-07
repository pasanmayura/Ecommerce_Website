"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, TextField } from "@mui/material";
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { getCategories, updateCategory } from "@/Services/categoryService";
import "@/styles/Structure.css"; 

const CategoryEdit = () => {
  const [CategoryID, setCategoryID] = useState('');
  const [Category_Name, setCategory_Name] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
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
      setErrorMessage('Category Name is required');
      alert('Category Name is required');
    } else {
      setErrorMessage('');
      const result = await updateCategory(CategoryID, Category_Name);
      if (result.message === 'Category updated successfully') {
        alert('Category Updated');
        router.push('/CategoryList'); 
      } else {
        setErrorMessage(result.message);
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
              {errorMessage && <p className="error-message">{errorMessage}</p>} 
            </div>
          </div>
      </main> 
    </div>
  );
};

export default CategoryEdit; 
