'use client';

import React, { useState } from 'react';
import Image from "next/image";
import { IconButton, Button } from '@mui/material';
import { useCart } from '@/contexts/CartContext';
import { removeFromWishlist } from '@/services/wishlistService';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarRating from '@/components/StarRating';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { useRouter } from 'next/navigation';
import '@/styles/WishlistItem.css';

// Helper function to convert Google Drive URL to direct image link
const getDirectImageUrl = (url) => {
  if (url.includes('drive.google.com')) {
    const fileId = url.split('/d/')[1]?.split('/')[0];
    const directUrl = fileId ? `https://drive.google.com/uc?id=${fileId}` : url;
    return directUrl;
  }
  return url;
};

const WishlistItem = ({ item, onRemove }) => {
  const { id, image, name, price, rating, availability = 'In Stock' } = item;
  const { addToCart } = useCart();
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  const handleRemove = async (e) => {
    e.stopPropagation();
    try {
      await removeFromWishlist(id); 
      console.log(`${name} removed from wishlist!`);

      onRemove && onRemove(id);
    } catch (error) {
      console.error('Error removing item from wishlist:', error.message);
    }    
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(item);
    console.log(`${name} added to cart!`);
  };

  const openConfirmationDialog = () => {
    setOpenDialog(true);
  };

  const closeConfirmationDialog = () => {
    setOpenDialog(false);
  };

  const handleCardClick = () => {
    router.push(`/ViewProduct?id=${id}`);
  };

  const formattedPrice = !isNaN(price) ? parseFloat(price).toFixed(2) : 'N/A';
  
  const isAvailable = availability === 'In Stock';
  
  return (
    <div className="wishlist-item" onClick={handleCardClick}>
      <div className="wishlist-item-image">
        <Image
          src={getDirectImageUrl(image)}
          alt={name}
          width={110}
          height={110}
          className="wishlist-product-img"
        />
      </div>
      
      <div className="wishlist-item-details">
        <h3 className="wishlist-item-name">{name}</h3>
        
        <div className="wishlist-item-rating">
          <StarRating rating={rating} />
        </div>
        
        <p className="wishlist-item-price">Rs.{formattedPrice}</p>
        
        <div className="wishlist-item-availability" data-available={isAvailable}>
          {availability}
        </div>
      </div>
      
      <div className="wishlist-item-actions" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="contained"
          className="wishlist-add-cart-btn"
          startIcon={<ShoppingCartIcon />}
          onClick={handleAddToCart}
          disabled={!isAvailable}
        >
          Add to Cart
        </Button>
        
        <div className="wishlist-secondary-actions" onClick={(e) => e.stopPropagation()}>         
          <IconButton 
            className="remove-wishlist-btn" 
            onClick={openConfirmationDialog}
            title="Remove from wishlist"
            aria-label="Remove from wishlist"
          >
            <DeleteOutlineIcon />
          </IconButton>
        </div>
      </div>
      <ConfirmationDialog
        open={openDialog}
        onClose={closeConfirmationDialog}
        onConfirm={handleRemove}
        title="Confirm Remove from Wishlist"
        message="Are you sure you want to remove the item from the wishlist ?"
      />
    </div>
  );
};

export default WishlistItem;