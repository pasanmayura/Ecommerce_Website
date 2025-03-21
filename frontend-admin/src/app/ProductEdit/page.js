"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, TextField } from "@mui/material";
import { Header } from "@/components/Header"; 
import { Sidebar } from "@/components/Sidebar";
import { getProducts } from "@/Services/productService";
import AlertComponent from '@/components/AlertComponent';
import "@/styles/Structure.css"; 
import "@/styles/Register.css"; 
import "@/styles/MostSold.css";
import "@/styles/EditProduct.css";

const ProductEdit = () => {
  const [Product, setProduct] = useState({
    ProductID: '',
    Product_Name: '',
    Description: '',
    Threshold: '',
    BatchID: '',
    Buying_Price: '',
    Selling_Price: '',
    Stock_Quantity: ''
  });
  const [alert, setAlert] = useState({ severity: '', title: '', message: '' });
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProducts = async () => {
      const id = searchParams.get('id');
      if (id) {
        const products = await getProducts(); // Fetch all products
        const product = products.find(pro => pro.ProductID === id); // Find the product by ID
        if (product) {
          setProduct(product); // Update the entire Product state
        }
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProduct(prevState => ({
      ...prevState,
      [id]: value, // Dynamically update the field based on the input's ID
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Product.Product_Name) {
      setAlert({ severity: 'error', title: 'Error', message: 'Product Name is required' });
    } else {
      setAlert('');
      const result = await updateProduct(Product.ProductID, Product); // Pass the entire Product object
      if (result.message === 'Product updated successfully') {
        setAlert({ severity: 'success', title: 'Success', message: 'Product updated successfully' });
        setTimeout(() => {
          router.push('/ProductList'); 
        }, 2000);
      } else {
        setAlert({ severity: 'error', title: 'Error', message: result.message });
      }
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
          <h1>Product Edit</h1>
          <div className="product-section">
            <form className="product" onSubmit={handleSubmit}>                  
              <div className="product-row">
                <TextField
                  label="Product ID"
                  id="ProductID"
                  value={Product.ProductID}
                  fullWidth
                  margin="normal"
                  disabled
                />
                <TextField
                  label="Product Name"
                  id="Product_Name"
                  value={Product.Product_Name}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </div>
              <div className="product-row">
                <TextField
                  label="Description"
                  id="Description"
                  value={Product.Description}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Batch ID"
                  id="BatchID"
                  value={Product.BatchID}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  disabled
                />                
              </div>
              <div className="product-row">
                <TextField
                  label="Threshold"
                  id="Threshold"
                  value={Product.Threshold}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Stock Quantity"
                  id="Stock_Quantity"
                  value={Product.Stock_Quantity}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />                
              </div>
              <div className="product-row">
                <TextField
                  label="Selling Price"
                  id="Selling_Price"
                  value={Product.Selling_Price}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Buying Price"
                  id="Buying_Price"
                  value={Product.Buying_Price}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />                
              </div>
              <Button variant="contained" className="product-button" type="submit">
                Save Changes
              </Button>
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

export default ProductEdit;
