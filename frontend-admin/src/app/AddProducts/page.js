'use client';

import React, { useState, useEffect } from 'react';
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { Button, TextField, MenuItem } from "@mui/material";
import { getCategories } from "@/Services/categoryService";
import { addProducts } from "@/Services/productService";
import uploadimg from "@/images/upload-icon.png";
import "@/styles/AddProducts.css";

const AddProducts = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [threshold, setThreshold] = useState('');
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories();
      setCategories(categories);
    };

    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files).map((file, index) => ({
      id: index,
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles(filesArray);
    setImagePreviews(filesArray.map(file => file.preview));
  };

  const handleRemoveImage = (id) => {
    const updatedFiles = files.filter(file => file.id !== id);
    setFiles(updatedFiles);
    setImagePreviews(updatedFiles.map(file => file.preview));
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
      alert('Product added successfully');
      setProductName('');
      setDescription('');
      setThreshold('');
      setSelectedCategory('');
      setFiles([]);
      setImagePreviews([]);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="common">
        <Header />
        
        <main className="main-content">
            <div className="sidebar-section">
                <Sidebar />
            </div>

            <div className="content">
                <h1>Manage Products</h1>
                <div className="form-section">
                    <p className="form-subtitle">Add Products</p>
                    <form className="form" onSubmit={handleSubmit}>

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
                              label="Product Description" 
                              id="ProductDescription" 
                              multiline 
                              rows={4} 
                              required 
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                            />
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

                        <div className="upload-section">                  
                            <input 
                                type="file" 
                                id="fileElem" 
                                multiple 
                                accept="image/*"  
                                required                                 
                                onChange={handleFileChange}
                            />
                            <label htmlFor="fileElem">
                                <img src={uploadimg} alt="Upload Icon" className='uploadimg'/>    
                            </label>
                            <span>Upload Images (max 3)</span>
                            <div className="image-previews">
                              {imagePreviews.map((preview, index) => (
                                <div key={index} className="image-preview-container">
                                  <img src={preview} alt="Preview" className="image-preview" />
                                  <button type="button" className="remove-image-button" onClick={() => handleRemoveImage(index)}>✖</button>
                                </div>
                              ))}
                            </div>
                        </div>                      
                        
                        <Button variant="contained" className="form-button" type="submit" style={{marginBottom:20}}>Add Product</Button>                            
                    </form>
                </div>
            </div>
        </main>      
    </div>
  );
};

export default AddProducts;