'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Divider, Paper, Typography } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CartItem from '@/components/CartItem';
import { Header } from "@/components/Header";
import { useCart } from '@/contexts/CartContext';
import '@/styles/ViewCart.css';

const ViewCart = () => {
  const router = useRouter();
  const { cartItems, setCartItems } = useCart();

  // Calculate cart totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const shippingCost = subtotal > 0 ? 300 : 0; // Free shipping over a certain amount
  const total = subtotal + shippingCost;

  // Handle quantity change
  const handleQuantityChange = (itemId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Handle item removal
  const handleRemoveItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Handle continue shopping
  const handleContinueShopping = () => {
    router.push('/HomePage');
  };

  // Handle checkout
  const handleCheckout = () => {
    router.push('/checkout');
  };

  // Render empty cart
  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <Paper className="empty-cart" elevation={0}>
          <ShoppingCartOutlinedIcon className="empty-cart-icon" />
          <Typography variant="h5" className="empty-cart-message">
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="textSecondary" style={{ marginBottom: '20px' }}>
            Looks like you haven't added any products to your cart yet.
          </Typography>
          <Button 
            variant="contained" 
            className="continue-shopping-btn"
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </Button>
        </Paper>
      </div>
    );
  }

  return (
    <div className="cart-main">
        <Header isHomePage={false} />
    
        <div className="cart-container">        
        <Typography variant="h4" className="cart-title">
            Your Shopping Cart
        </Typography>
        
        <div className="cart-content">
            <div className="cart-items">
            <Paper className="cart-items-paper" elevation={0}>
                <div className="cart-items-header">
                <Typography variant="body2" className="cart-header-product">Product</Typography>
                <Typography variant="body2" className="cart-header-quantity">Quantity</Typography>
                <Typography variant="body2" className="cart-header-subtotal">Subtotal</Typography>
                <div className="cart-header-actions"></div>
                </div>
                
                <Divider />
                
                <div className="cart-items-container">
                {cartItems.map(item => (
                    <CartItem 
                    key={item.id} 
                    item={item} 
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                    />
                ))}
                </div>
            </Paper>
            
            <Button 
                variant="text" 
                className="continue-btn" 
                onClick={handleContinueShopping}
            >
                ← Continue Shopping
            </Button>
            </div>
            
            <div className="cart-summary">
            <Paper className="summary-paper" elevation={0}>
                <Typography variant="h6" className="summary-title">
                Order Summary
                </Typography>
                
                <Divider />
                
                <div className="summary-content">
                <div className="summary-row">
                    <Typography variant="body2">Subtotal</Typography>
                    <Typography variant="body1">Rs.{subtotal.toFixed(2)}</Typography>
                </div>
                
                <div className="summary-row">
                    <Typography variant="body2">Shipping</Typography>
                    <Typography variant="body1">Rs.{shippingCost.toFixed(2)}</Typography>
                </div>
                
                <Divider className="summary-divider" />
                
                <div className="summary-row total">
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6" className="total-amount">Rs.{total.toFixed(2)}</Typography>
                </div>
                
                <Button 
                    variant="contained" 
                    fullWidth 
                    className="checkout-btn"
                    onClick={handleCheckout}
                >
                    Proceed to Checkout
                </Button>
                
                <div className="payment-info">
                    <Typography variant="caption" color="textSecondary">
                    Secure payment | Fast delivery | Easy returns
                    </Typography>
                </div>
                </div>
            </Paper>
            </div>
        </div>
        </div>
    </div>
  );
};

export default ViewCart;