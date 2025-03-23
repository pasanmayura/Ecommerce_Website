'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { Button, TextField, MenuItem } from "@mui/material";
import { getCategories } from "@/Services/categoryService";
import { addProducts } from "@/Services/productService";
import AlertComponent from '@/components/AlertComponent';
import "@/styles/AddProducts.css";

const AddProducts = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [threshold, setThreshold] = useState('');
  const [imageFiles, setImageFiles] = useState([null, null, null]); 
  const [imagePreviews, setImagePreviews] = useState([null, null, null]); 
  const [alert, setAlert] = useState({ severity: '', title: '', message: '' });

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories();
      setCategories(categories);
    };

    fetchCategories();
  }, []);

  const handleImageChange = (index, file) => {
    const updatedFiles = [...imageFiles];
    const updatedPreviews = [...imagePreviews];
  
    updatedFiles[index] = file; // Update the selected file
    updatedPreviews[index] = file ? URL.createObjectURL(file) : null; // Update the preview
  
    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = [...imageFiles];
    const updatedPreviews = [...imagePreviews];
  
    updatedFiles[index] = null; // Remove the file
    updatedPreviews[index] = null; // Remove the preview
  
    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('Product_Name', productName);
    formData.append('Description', description);
    formData.append('Threshold', threshold);
    formData.append('CategoryID', selectedCategory);
    for (const file of files) {
      formData.append('files', file.file);
    }

    const result = await addProducts(formData);
    if (result.message === 'Product added successfully') {
      setAlert({ severity: 'success', title: 'Success', message: 'Product added successfully' });
      setProductName('');
      setDescription('');
      setThreshold('');
      setSelectedCategory('');
      setFiles([]);
      setImagePreviews([]);
    } else {
      setAlert({ severity: 'error', title: 'Error', message: result.message });
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
                <h1>Add Products</h1>
                <div className="form-section">
                    <form className="form" onSubmit={handleSubmit}>
                      <div className="row-1">
                        <div className="form-group">
                            <TextField 
                              fullWidth 
                              label="Product Name" 
                              id="ProductName" 
                              required 
                              value={productName}
                              onChange={(e) => setProductName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <TextField
                              fullWidth
                              select
                              label="Category"
                              required
                              value={selectedCategory}
                              onChange={(e) => setSelectedCategory(e.target.value)}                                                  
                            >
                              {categories.map((category) => (
                                <MenuItem key={category.CategoryID} value={category.CategoryID}>
                                  {category.Category_Name}
                                </MenuItem>
                              ))}
                            </TextField>
                        </div>   

                        <div className="form-group">
                            <TextField 
                              fullWidth 
                              label="Threshold Quantity" 
                              id="ThresholdQuantity" 
                              required
                              value={threshold}
                              onChange={(e) => setThreshold(e.target.value)}
                            />
                        </div>
                      </div>                       

                        <div className="form-group">
                            <TextField 
                              fullWidth 
                              label="Product Description" 
                              id="ProductDescription" 
                              multiline 
                              rows={4} 
                              required 
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>      

                      <div className="row-3">  
                        <div className="form-group">
                          <TextField
                            type="file"
                            label="Upload File"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ accept: ".png, .jpg" }} 
                            fullWidth
                            required
                            onChange={(e) => handleImageChange(0, e.target.files[0])} // Handle the first file input
                          />
                          {imagePreviews[0] && (
                            <div className="image-preview-container">
                              <img src={imagePreviews[0]} alt="Preview" className="image-preview" />
                              <button
                                type="button"
                                className="remove-image-button"
                                onClick={() => handleRemoveImage(0)}
                              >
                                &times;
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="form-group">
                          <TextField
                            type="file"
                            label="Upload File"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ accept: ".png, .jpg" }} 
                            fullWidth
                            required
                            onChange={(e) => handleImageChange(1, e.target.files[0])} 
                          />
                          {imagePreviews[1] && (
                            <div className="image-preview-container">
                              <img src={imagePreviews[1]} alt="Preview" className="image-preview" />
                              <button
                                type="button"
                                className="remove-image-button"
                                onClick={() => handleRemoveImage(1)}
                              >
                                &times;
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="form-group">
                          <TextField
                            type="file"
                            label="Upload File"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ accept: ".png, .jpg" }} 
                            fullWidth
                            required
                            onChange={(e) => handleImageChange(2, e.target.files[0])} 
                          />
                          {imagePreviews[2] && (
                            <div className="image-preview-container">
                              <img src={imagePreviews[2]} alt="Preview" className="image-preview" />
                              <button
                                type="button"
                                className="remove-image-button"
                                onClick={() => handleRemoveImage(2)}
                              >
                                &times;
                              </button>
                            </div>
                          )}
                        </div>
                      </div>                                                         
                                                    
                    </form>
                    <Button variant="contained" className="form-button" type="submit" style={{marginBottom:20}}>Add Product</Button>
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

export default AddProducts;