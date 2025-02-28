'use client';

import React, { useState, useEffect } from 'react';
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { Button, TextField, MenuItem } from "@mui/material";
import { getProductsID, addBatch } from '@/Services/batchService';

const AddBatch = () => {  
    const [products, setProducts] = useState([]);  
    const [selectedProductID, setSelectedProductID] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');
    const [buyingPrice, setBuyingPrice] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProductsID();
            console.log('Fetched products:', data);
            setProducts(data);
        };

        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const batchData = {
            ProductID: selectedProductID,
            StockQuantity: stockQuantity,
            BuyingPrice: buyingPrice,
            SellingPrice: sellingPrice
        };
        const result = await addBatch(batchData);
        if (result.message === 'Batch added successfully') {
            alert('Batch added successfully');
            setSelectedProductID('');
            setStockQuantity('');
            setBuyingPrice('');
            setSellingPrice('');
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
                        <p className="form-subtitle">Add Batch</p>
                        <form className="form" onSubmit={handleSubmit}>

                            <div className="form-group">
                                <TextField
                                fullWidth
                                select
                                label="Product ID"
                                required
                                value={selectedProductID}
                                onChange={(e) => setSelectedProductID(e.target.value)}                                                  
                                >
                                {products.map((product) => (
                                    <MenuItem key={product.ProductID} value={product.ProductID}>
                                    {product.Product_Name}
                                    </MenuItem>
                                ))}
                                </TextField>
                            </div>                      

                            <div className="form-group">
                                <TextField 
                                fullWidth 
                                label="Stock Quantity" 
                                id="StockQuantity"                                
                                required 
                                value={stockQuantity}
                                onChange={(e) => setStockQuantity(e.target.value)}
                                />
                            </div>                        

                            <div className="form-group">
                                <TextField 
                                fullWidth 
                                label="Buying Price" 
                                id="BuyingPrice" 
                                required
                                value={buyingPrice}
                                onChange={(e) => setBuyingPrice(e.target.value)}
                                />
                            </div>  

                            <div className="form-group">
                                <TextField 
                                fullWidth 
                                label="Selling Price" 
                                id="sellingPrice" 
                                required
                                value={sellingPrice}
                                onChange={(e) => setSellingPrice(e.target.value)}
                                />
                            </div>         
                            <Button variant="contained" className="form-button" type="submit" style={{marginBottom:20}}>Add Batch</Button>                            
                        </form>
                    </div>
                </div>
            </main>  
        </div>
    );
};

export default AddBatch;
