'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import Image from 'next/image';
import { 
  Button, 
  TextField, 
  MenuItem,  
  Paper, 
  Typography, 
  Box, 
  Grid, 
  Divider, 
  Chip
} from "@mui/material";
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { getCategories } from "@/Services/categoryService";
import { addProducts } from "@/Services/productService";
import LoadingComponent from '@/components/LoadingComponent';
import AlertComponent from '@/components/AlertComponent';
import '@/styles/AddProducts.css';

const AddProducts = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [threshold, setThreshold] = useState('');
  const [imageFiles, setImageFiles] = useState([null, null, null]); 
  const [imagePreviews, setImagePreviews] = useState([null, null, null]); 
  const [alert, setAlert] = useState({ severity: '', title: '', message: '' });
  const fileInputRefs = [useRef(null), useRef(null), useRef(null)];
  const [loading, setLoading] = useState(false);

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
  
    updatedFiles[index] = file;
    updatedPreviews[index] = file ? URL.createObjectURL(file) : null;
  
    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = [...imageFiles];
    const updatedPreviews = [...imagePreviews];
  
    updatedFiles[index] = null;
    updatedPreviews[index] = null;
  
    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
    
    if (fileInputRefs[index].current) {
      fileInputRefs[index].current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (Number(threshold) < 0) {
      setAlert({
        severity: 'error',
        title: 'Invalid Threshold',
        message: 'Threshold Quantity cannot be negative.',
      });
      setLoading(false);
      return;
    }
        
    const formData = new FormData();
    formData.append('Product_Name', productName);
    formData.append('Description', description);
    formData.append('Threshold', threshold);
    formData.append('CategoryID', selectedCategory);

    // Append image files
    for (const file of imageFiles) {
      if (file) {
        formData.append('files', file); 
      }
    }

    try {
      const response = await addProducts(formData);
      if (response.message === 'Product added successfully') {
        setAlert({ 
          severity: 'success', 
          title: 'Success', 
          message: 'Product added successfully' 
        });
        
        // Reset form fields
        setProductName('');
        setDescription('');
        setThreshold('');
        setSelectedCategory('');
        setImageFiles([null, null, null]);
        setImagePreviews([null, null, null]);

        // Reset file input fields
        fileInputRefs.forEach((ref) => {
          if (ref.current) {
            ref.current.value = '';
          }
        });
      } else {
        setAlert({ 
          severity: 'error', 
          title: 'Error', 
          message: response.message 
        });
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setAlert({ 
        severity: 'error', 
        title: 'Error', 
        message: 'Failed to add product. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const closeAlert = () => {
    setAlert({ severity: '', title: '', message: '' });
  };

  return (
    <div className="addproduct-page">
      <Header />
      
      <main className="addproduct-main-content">
        <div className="addproduct-sidebar">
          <Sidebar />
        </div>

        <div className="addproduct-content">
          <div className="addproduct-header">
            <Typography variant="h4" className="addproduct-title">
              Add Product
            </Typography>
            <Chip 
              icon={<CategoryIcon />} 
              label={`${categories.length} Categories Available`} 
              color="primary" 
              variant="outlined" 
              className="category-chip"
            />
          </div>

          <Paper elevation={3} className="addproduct-form-container">
            <Box className="addproduct-form-header">
              <Typography variant="h6" className="addproduct-form-title">
                Product Details
              </Typography>
              <Divider className="form-divider" />
            </Box>
            
            <form className="addproduct-form" onSubmit={handleSubmit}>
              {/* Basic Information Section */}
              <Box className="addproduct-form-section">
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField 
                      fullWidth 
                      label="Product Name" 
                      id="ProductName" 
                      required 
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="text-field"
                      InputProps={{
                        startAdornment: <LocalOfferIcon className="field-icon" />,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      select
                      label="Category"
                      required
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-field"
                      InputProps={{
                        startAdornment: <CategoryIcon className="field-icon" />,
                      }}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.CategoryID} value={category.CategoryID}>
                          {category.Category_Name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>   

                  <Grid item xs={12} md={4}>
                    <TextField 
                      fullWidth 
                      label="Threshold Quantity" 
                      id="ThresholdQuantity" 
                      required
                      type="number"
                      value={threshold}
                      onChange={(e) => setThreshold(e.target.value)}
                      className="text-field"
                      InputProps={{
                        startAdornment: <NotificationsIcon className="field-icon" />,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Product Description" 
                      id="ProductDescription" 
                      multiline 
                      rows={4} 
                      required 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="text-field description-field"
                      InputProps={{
                        startAdornment: <DescriptionIcon className="field-icon description-icon" />,
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Images Section */}
              <Box className="addproduct-form-section images-section">
                <Typography variant="h6" className="addproduct-section-title">
                  Product Images
                </Typography>
                <Divider className="section-divider" />
                
                <Grid container spacing={3}>
                  {[0, 1, 2].map((index) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <Paper elevation={1} className="image-upload-container">
                        {imagePreviews[index] ? (
                          <div className="image-preview-wrapper">
                            <Image 
                              src={imagePreviews[index]} 
                              alt={`Preview ${index + 1}`} 
                              className="image-preview" 
                              width={200} 
                              height={200} 
                              priority 
                            />
                            <Button 
                              className="remove-image-button"
                              onClick={() => handleRemoveImage(index)}
                              variant="contained"
                              color="error"
                              size="small"
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div className="upload-placeholder">
                            <ImageIcon className="upload-icon" />
                            <Typography variant="body2" className="upload-text">
                              Image {index + 1}
                            </Typography>
                            <Button
                              variant="contained"
                              component="label"
                              className="upload-button"
                            >
                              Select File
                              <input
                                type="file"
                                accept=".png, .jpg, .jpeg"
                                hidden
                                ref={fileInputRefs[index]}
                                onChange={(e) => handleImageChange(index, e.target.files[0])}
                              />
                            </Button>
                          </div>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Submit Button */}
              <Box className="addproduct-form-actions">
                <Button 
                  variant="contained" 
                  type="submit" 
                  className="submit-button"
                  size="large"
                  disabled={loading}
                >
                  Add Product
                </Button>
              </Box>
            </form>
          </Paper>
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
      
      {loading && <LoadingComponent message="Adding product, please wait..." />}
    </div>
  );
};

export default AddProducts;