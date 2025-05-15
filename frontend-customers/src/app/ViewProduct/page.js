'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Header } from "@/components/Header";
import { getProductDetails, getProductComments } from '@/services/productService';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import { Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { HiOutlineShare } from "react-icons/hi";
import Comment from '@/components/Comment'; 
import StarRating from '@/components/StarRating'; 
import { addToWishlist, removeFromWishlist, getWishlist } from '@/services/wishlistService';
import ShareModal from '@/components/ShareModal'; 
import "aos/dist/aos.css";
import '@/styles/ViewProduct.css';

const ViewProduct = () => {
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState('white');
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedImage, setSelectedImage] = useState(0);
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');
    const [comments, setComments] = useState([]); 
    const { addToCart } = useCart(); 
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false); // Share modal state
    const router = useRouter();

    const shareUrl = `https://smartkade.com/ViewProduct?id=${productId}`; 
    const title = `Check out this product: ${product?.name}`;

    useEffect(() => {
        const fetchProductDetails = async () => {
          try {
            const productData = await getProductDetails(productId);
            productData.attributes = productData.attributes || [];
            setProduct(productData);
          } catch (error) {
            console.error('Error fetching product details:', error.message);
          }
        };

        const fetchComments = async () => {
          try {
            const commentsData = await getProductComments(productId);
            console.log('Fetched comments:', commentsData);
            setComments(commentsData);
          } catch (error) {
            console.error('Error fetching comments:', error.message);
          }
        };

        const checkWishlistStatus = async () => {
          try {
            const wishlist = await getWishlist(); // Fetch the user's wishlist
            console.log('Fetched wishlist:', wishlist); // Debugging: Log the fetched wishlist
            setIsWishlisted(wishlist.some(item => item.id === productId)); // Check if the product is in the wishlist
          } catch (error) {
            console.error('Error checking wishlist status:', error.message);
          }
        };
    
        if (productId) {
          fetchProductDetails();
          fetchComments(); // Fetch comments for the product
          checkWishlistStatus(); // Check if the product is in the wishlist
        }
      }, [productId]);
    
      if (!product) {
        return <div className="loading-container">Loading...</div>;
      }

    const { id, image1, image2, image3, name, description, price, rating, attributes } = product;

    const handleAddToCart = () => {
      const cartItem = {
        id: productId, // Use the product ID
        name,
        price,
        image: productImages[selectedImage], // Use the currently selected image
        color: selectedColor,
        size: selectedSize,
        quantity,
      };
    
      addToCart(cartItem); // Add the item to the cart using the CartContext
      console.log(`${name} added to cart with quantity: ${quantity}, color: ${selectedColor}, size: ${selectedSize}`);
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
            await removeFromWishlist(id); // Remove from wishlist
            setIsWishlisted(false);
            console.log(`${name} removed from wishlist!`);
          } else {
            await addToWishlist(id); // Add to wishlist
            setIsWishlisted(true);
            console.log(`${name} added to wishlist!`);
          }
        } catch (error) {
          console.error('Error toggling wishlist:', error.message);
        }
    };
      
    const processedAttributes = {
      color: [],
      size: []
    };
    
    attributes.forEach(attr => {
      if (attr.attribute === "color") {
        processedAttributes.color.push(attr.value);
      } else if (attr.attribute === "size") {
        processedAttributes.size.push(attr.value);
      }
    });
  
    const getDirectImageUrl = (url) => {
        if (url && url.includes('drive.google.com')) {
          const fileId = url.split('/d/')[1]?.split('/')[0];
          return fileId ? `https://drive.google.com/uc?id=${fileId}` : url;
        }
        return url;
    };

    const productImages = [
      getDirectImageUrl(image1),
      getDirectImageUrl(image2),
      getDirectImageUrl(image3),
    ];

    const handleQuantityChange = (action) => {
      if (action === 'increase') {
        setQuantity(prev => prev + 1);
      } else if (action === 'decrease' && quantity > 1) {
        setQuantity(prev => prev - 1);
      }
    };

    const handleColorSelect = (color) => {
      setSelectedColor(color);
    };

    const handleSizeSelect = (size) => {
      setSelectedSize(size);
    }; 
    
    const openShareModal = () => {
      setIsShareModalOpen(true);
    };
    
    const closeShareModal = () => {
      setIsShareModalOpen(false);
    };

    const handleBuyNow = () => {
      const productData = {
        id: productId,
        name,
        price,
        quantity,
      };

      localStorage.removeItem('cartItems');
  
      // Redirect to the Checkout page with product data as query parameters
      const queryString = new URLSearchParams(productData).toString();
      router.push(`/Checkout?${queryString}`);
    };

    return (
        <div className="view-product">
          <Header isHomePage={false} />
          <main className="product-content-container">
            <div className="product-gallery">
              <div className="thumbnail-container">
                {productImages.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={img}
                      alt={`${name} thumbnail ${index + 1}`}
                      width={100}
                      height={100}
                      objectFit="contain"
                    />
                  </div>
                ))}
              </div>
              <div className="main-image-container">
                <Image
                  src={productImages[selectedImage]}
                  alt={name}
                  width={500}
                  height={500}
                  objectFit="contain"
                  className="main-product-image"
                />
              </div>
            </div>
            
            <div className="product-info">
              <h1 className="product-title">{name}</h1>               
              
              <div className="product-price">Rs. {!isNaN(price) ? parseFloat(price).toFixed(2) : 'N/A'}</div>
              
              <div className="product-description">
                {description}
              </div>

              {/* Product Rating */}
              <div className="product-rating">
                <StarRating rating={rating} />
                <span className="rating-value">({rating.toFixed(1)})</span>
              </div>
              
              <div className="product-options">
                {processedAttributes.color.length > 0 && (
                  <div className="color-options">
                    <span className="option-label">Colours:</span>
                    <div className="color-selector">
                      {processedAttributes.color.map((color) => (
                        <button 
                          key={color}
                          className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                          onClick={() => handleColorSelect(color)}
                          style={{ backgroundColor: color.toLowerCase() }}
                        ></button>
                      ))}
                    </div>
                  </div>
                )}
                
                {processedAttributes.size.length > 0 && (
                  <div className="size-options">
                    <span className="option-label">Size:</span>
                    <div className="size-selector">
                      {processedAttributes.size.map((size) => (
                        <button 
                          key={size}
                          className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                          onClick={() => handleSizeSelect(size)}
                        >
                          {size.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="product-actions">
                <div className="quantity-selector">
                  <button className="quantity-btn" onClick={() => handleQuantityChange('decrease')}>−</button>
                  <input type="text" value={quantity} readOnly className="quantity-input" />
                  <button className="quantity-btn" onClick={() => handleQuantityChange('increase')}>+</button>
                </div>
                
                <Button variant='' className="buy-now-btn" onClick={handleBuyNow}>Buy Now</Button>
                <button className="wishlist-btn" onClick={handleWishlistToggle}>
                  <FavoriteIcon 
                    className="heart-icon" 
                    style={{ color: isWishlisted ? '#ff6b6b' : '#ccc' }} // Change color dynamically
                  />
                </button>
              </div>
              
              <div className="additional-actions">
                <Button variant="outlined" className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</Button>
                <button className="share-btn" onClick={openShareModal}><HiOutlineShare /></button>
              </div>
            </div>
          </main>
          {/* Comment Section */}
        <div className="product-comments">
          <h2>Comments</h2>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Comment
                key={comment.id}
                name={comment.name}
                rating={comment.rating}
                date={comment.date}
                text={comment.text}
              />
            ))
          ) : (
            <p>No comments yet. Be the first to comment!</p>
          )}
        </div>
        {/* Share Modal */}
        <ShareModal
          open={isShareModalOpen}
          onClose={closeShareModal}
          shareUrl={shareUrl}
          title={title}
        />
        </div>
      );
    };
    

export default ViewProduct;