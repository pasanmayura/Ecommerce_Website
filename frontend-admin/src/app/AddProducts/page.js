'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { 
  Button, 
  TextField, 
  MenuItem, 
  IconButton, 
  Paper, 
  Typography, 
  Box, 
  Grid, 
  Divider, 
  Chip
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { getCategories } from "@/Services/categoryService";
import { addProducts, getAttributes } from "@/Services/productService";
import LoadingComponent from '@/components/LoadingComponent';
import AlertComponent from '@/components/AlertComponent';
import '@/styles/AddProducts.css';

const AddProducts = () => {
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [productAttributes, setProductAttributes] = useState([{ attribute: '', value: '' }]);
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

    const fetchAttributes = async () => {
      try {
        const attributes = await getAttributes();
        console.log('Fetched attributes:', attributes);
        setAttributes(attributes);
      } catch (error) {
        console.error('Error fetching attributes:', error);
      }
    };

    fetchCategories();
    fetchAttributes();
  }, []);

  const handleAddAttributeField = () => {
    setProductAttributes([...productAttributes, { attribute: '', value: '' }]);
  };

  const handleRemoveAttributeField = (index) => {
    const updatedAttributes = [...productAttributes];
    updatedAttributes.splice(index, 1);
    setProductAttributes(updatedAttributes);
  };

  const handleAttributeChange = (index, field, value) => {
    const updatedAttributes = [...productAttributes];
    updatedAttributes[index][field] = value;
    setProductAttributes(updatedAttributes);
  };

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
    
    const formData = new FormData();
    formData.append('Product_Name', productName);
    formData.append('Description', description);
    formData.append('Threshold', threshold);
    formData.append('CategoryID', selectedCategory);
    formData.append('Attributes', JSON.stringify(productAttributes));

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
        setProductAttributes([{ attribute: '', value: '' }]);

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

              {/* Attributes Section */}
              <Box className="addproduct-form-section addproduct-attributes-section">
                <Typography variant="h6" className="addproduct-section-title">
                  Product Attributes
                </Typography>
                <Divider className="section-divider" />
                
                <Box className="addproduct-attributes-container">
                  {productAttributes.map((attr, index) => (
                    <Paper elevation={1} key={index} className="attribute-row">
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={5}>
                          <TextField
                            select
                            label="Attribute"
                            fullWidth
                            value={attr.attribute}
                            onChange={(e) => handleAttributeChange(index, 'attribute', e.target.value)}
                            className="attribute-field"
                          >
                            {attributes.map((attribute) => (
                              <MenuItem key={attribute.id} value={attribute.id}>
                                {attribute.Attribute_Name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        
                        <Grid item xs={12} sm={5}>
                          <TextField
                            label="Value"
                            fullWidth
                            value={attr.value}
                            onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                            className="attribute-field"
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={2} className="addproduct-attribute-actions">
                          <IconButton 
                            onClick={() => handleRemoveAttributeField(index)} 
                            disabled={productAttributes.length === 1}
                            className="remove-attribute-btn"
                            color="error"
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Box>
                
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddAttributeField}
                  className="add-attribute-btn"
                >
                  Add Attribute
                </Button>
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
                            <img 
                              src={imagePreviews[index]} 
                              alt={`Preview ${index + 1}`} 
                              className="image-preview" 
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