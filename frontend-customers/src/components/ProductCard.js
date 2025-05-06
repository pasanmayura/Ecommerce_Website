'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import '@/styles/ProductCard.css';

// Helper function to convert Google Drive URL to direct image link
const getDirectImageUrl = (url) => {
  if (url.includes('drive.google.com')) {
    const fileId = url.split('/d/')[1]?.split('/')[0];
    const directUrl = fileId ? `https://drive.google.com/uc?id=${fileId}` : url;
    console.log('Converted URL:', directUrl); // Debugging
    return directUrl;
  }
  return url; // Return the original URL if it's not a Google Drive URL
};

const ProductCard = ({ product }) => {
  const { id, image, name, price, sold_count } = product;
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/ViewProduct?id=${id}`); // Navigate to the View Product page with the ProductID
  };

  const handleAddToCart = () => {
    console.log(`${name} added to cart!`);
    // "Add to Cart" logic here
  };

  return (
    <div className="product-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="product-image">
        <Image
          src={getDirectImageUrl(image)}
          alt={name}
          width={150} 
          height={150} 
        />
      </div>
      <div className="product-details">
        <h3 className="product-name">{name}</h3>
        <p className="product-price">
          Rs.{!isNaN(price) ? parseFloat(price).toFixed(2) : 'N/A'}
        </p>
        <p className="product-sold">Sold: {sold_count}</p>
        <Button
          variant="contained"
          className='btn-cart'
          color="#f8f8f8"
          startIcon={<ShoppingCartIcon />}
          onClick={handleAddToCart}
          style={{backgroundColor:"#0A2F6E", color:"#fff"}}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;