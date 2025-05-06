'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarRating from '@/components/StarRating'; 
import { useCart } from '@/contexts/CartContext';
import '@/styles/ProductCard.css';

// Helper function to convert Google Drive URL to direct image link
const getDirectImageUrl = (url) => {
  if (url.includes('drive.google.com')) {
    const fileId = url.split('/d/')[1]?.split('/')[0];
    const directUrl = fileId ? `https://drive.google.com/uc?id=${fileId}` : url;
    return directUrl;
  }
  return url;
};

const ProductCard = ({ product }) => {
  const { id, image, name, price, sold_count, rating } = product;
  const router = useRouter();
  const [isHovered, setIsHovered] = React.useState(false);
  const { addToCart } = useCart();

  const handleCardClick = () => {
    router.push(`/ViewProduct?id=${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // to prevent card click
    addToCart(product); // 👈 add to cart
    console.log(`${name} added to cart!`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation(); // Prevent card click event from firing
    console.log(`${name} added to wishlist!`);
    // Wishlist logic here
  };

  const formattedPrice = !isNaN(price) ? parseFloat(price).toFixed(2) : 'N/A';

  return (
    <div 
      className="product-card" 
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-badge">
        {sold_count > 50 && <span className="badge bestseller">Bestseller</span>}
      </div>
      
      <div className="wishlist-icon" onClick={handleWishlist}>
        <FavoriteIcon className="heart-icon" />
      </div>
      
      <div className="product-image-container">
        <div className={`product-image ${isHovered ? 'zoomed' : ''}`}>
          <Image
            src={getDirectImageUrl(image)}
            alt={name}
            width={220}
            height={220}
            className="product-img"
          />
        </div>
      </div>
      
      <div className="product-details">
        <h3 className="product-name">{name}</h3>
        
        <div className="product-rating-row">
          <StarRating rating={rating} />
          <span className="sold-count">{sold_count} sold</span>
        </div>
        
        <div className="product-price-container">
          <p className="product-price">Rs.{formattedPrice}</p>
        </div>
        
        <Button
          variant="contained"
          className="btn-cart"
          onClick={handleAddToCart}
          startIcon={<ShoppingCartIcon />}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;