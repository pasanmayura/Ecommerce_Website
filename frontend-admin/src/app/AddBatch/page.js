'use client';

import React, { useState, useEffect } from 'react';
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { Button, TextField, MenuItem, Paper, Box, Typography, Grid, Divider } from "@mui/material";
import { getProductsID, getProductAttributes, addBatch } from '@/Services/batchService';
import AlertComponent from '@/components/AlertComponent';
import '@/styles/AddBatch.css';

const AddBatch = () => {  
    const [products, setProducts] = useState([]);  
    const [selectedProductID, setSelectedProductID] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');
    const [buyingPrice, setBuyingPrice] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
    const [attributes, setAttributes] = useState([]);
    const [attributeQuantities, setAttributeQuantities] = useState({});
    const [alert, setAlert] = useState({ severity: '', title: '', message: '' });

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProductsID();
            console.log('Fetched products:', data);
            setProducts(data);
        };

        fetchProducts();
    }, []);

    const handleProductChange = async (productID) => {
        setSelectedProductID(productID);

        // Fetch attributes for the selected product
        const attributesData = await getProductAttributes(productID);
        console.log('Fetched attributes:', attributesData);
        setAttributes(attributesData);

        // Initialize attributeQuantities with empty values
        const initialQuantities = {};
        attributesData.forEach(attr => {
            initialQuantities[attr.id] = '';
        });
        setAttributeQuantities(initialQuantities);
    };

    const handleQuantityChange = (attributeID, value) => {
        setAttributeQuantities((prev) => ({
            ...prev,
            [attributeID]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const batchData = {
            ProductID: selectedProductID,
            StockQuantity: stockQuantity,
            BuyingPrice: buyingPrice,
            SellingPrice: sellingPrice,
            AttributeQuantities: attributeQuantities,
        };
        const result = await addBatch(batchData);
        if (result.message === 'Batch added successfully') {
            setAlert({ severity: 'success', title: 'Success', message: 'Batch added successfully' });
            setSelectedProductID('');
            setStockQuantity('');
            setBuyingPrice('');
            setSellingPrice('');
            setAttributes([]);
            setAttributeQuantities({});
        } else {
            setAlert({ severity: 'error', title: 'Error', message: result.message });
        }
    };

    const closeAlert = () => {
        setAlert({ severity: '', title: '', message: '' });
    };

    return (
        <div className="add-batch-page">
            <Header />
            <main className="addbatch-main-content">
                <div className="sidebar-section">
                    <Sidebar />
                </div>
            
                <div className="addbatch-content">
                    <Typography variant="h4" className="page-title">
                        Add Batch
                    </Typography>
                    
                    <Paper elevation={3} className="addbatch-form-container">
                        <Typography variant="h6" className="form-title">
                            Batch Details
                        </Typography>
                        <Divider className="form-divider" />
                        
                        <form className="batch-form" onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Product"
                                        required
                                        value={selectedProductID}
                                        onChange={(e) => handleProductChange(e.target.value)}
                                        className="form-field"
                                    >
                                        {products.map((product) => (
                                            <MenuItem key={product.ProductID} value={product.ProductID}>
                                                {product.Product_Name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <TextField 
                                        fullWidth 
                                        label="Stock Quantity" 
                                        id="StockQuantity"                                
                                        required 
                                        value={stockQuantity}
                                        onChange={(e) => setStockQuantity(e.target.value)}
                                        className="form-field"
                                        type="number"
                                    />
                                </Grid>                        

                                <Grid item xs={12} md={4}>
                                    <TextField 
                                        fullWidth 
                                        label="Buying Price" 
                                        id="BuyingPrice" 
                                        required
                                        value={buyingPrice}
                                        onChange={(e) => setBuyingPrice(e.target.value)}
                                        className="form-field"
                                        type="number"
                                        InputProps={{
                                            startAdornment: <span className="currency-symbol">Rs.</span>,
                                        }}
                                    />
                                </Grid>  

                                <Grid item xs={12} md={4}>
                                    <TextField 
                                        fullWidth 
                                        label="Selling Price" 
                                        id="sellingPrice" 
                                        required
                                        value={sellingPrice}
                                        onChange={(e) => setSellingPrice(e.target.value)}
                                        className="form-field"
                                        type="number"
                                        InputProps={{
                                            startAdornment: <span className="currency-symbol">Rs.</span>,
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            {attributes.length > 0 && (
                                <Box className="attributes-section">
                                    <Typography variant="h6" className="attributes-title">
                                        Attribute Quantities
                                    </Typography>
                                    <Divider className="attributes-divider" />
                                    
                                    <Grid container spacing={3}>
                                        {attributes.map((attr) => (
                                            <Grid item xs={12} sm={6} md={4} key={attr.id}>
                                                <div className="attribute-item">
                                                    <Typography variant="subtitle1" className="attribute-name">
                                                        {attr.value}
                                                    </Typography>
                                                    <TextField
                                                        fullWidth
                                                        label={`Quantity`}
                                                        value={attributeQuantities[attr.id] || ''}
                                                        onChange={(e) => handleQuantityChange(attr.id, e.target.value)}
                                                        className="attribute-field"
                                                        type="number"
                                                    />
                                                </div>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}

                            <Box className="form-actions">
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    type="submit" 
                                    className="submit-button"
                                    size="large"
                                >
                                    Add Batch
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
        </div>
    );
};

export default AddBatch;