'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarRating from '@/components/StarRating'; 
import { useCart } from '@/contexts/CartContext';
import { addToWishlist, removeFromWishlist, getWishlist } from '@/services/wishlistService';
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
  const { id, image, name, price, sold_count, rating = 0 } = product;
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const wishlist = await getWishlist(); // Fetch the user's wishlist
        console.log('Fetched wishlist:', wishlist); // Debugging: Log the fetched wishlist
        setIsWishlisted(wishlist.some(item => item.id === id)); // Check if the product is in the wishlist
      } catch (error) {
        console.error('Error checking wishlist status:', error.message);
      }
    };
  
    checkWishlistStatus(); // Call the function to check wishlist status
  }, [id]);

  const handleCardClick = () => {
    router.push(`/ViewProduct?id=${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click
    addToCart(product); // Add to cart
    console.log(`${name} added to cart!`);
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();

    // Check if the user is logged in
    const token = sessionStorage.getItem('jwtToken'); // Replace with your token key
    if (!token) {
      alert('Please log in to add items to your wishlist.');
      router.push('/SignIn'); // Redirect to the login page
      return;
    }
    
    try {
      if (isWishlisted) {
        setIsWishlisted(false); // Optimistically update the state
        await removeFromWishlist(id); // Remove from wishlist
        console.log(`${name} removed from wishlist!`);
      } else {
        setIsWishlisted(true); // Optimistically update the state
        await addToWishlist(id); // Add to wishlist
        console.log(`${name} added to wishlist!`);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error.message);
      // Revert the state if the API call fails
      setIsWishlisted((prev) => !prev);
    }
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
      
      <div 
        className="wishlist-icon" 
        onClick={handleWishlistToggle} 
        style={{ color: isWishlisted ? '#ff6b6b' : '#ccc' }}
      >
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