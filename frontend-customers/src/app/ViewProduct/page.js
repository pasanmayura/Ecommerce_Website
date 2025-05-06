'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios'; // Import axios
import { Header } from "@/components/Header";
import { getProductDetails, getProductComments } from '@/services/productService';
import Image from 'next/image';
import { GrFavorite } from "react-icons/gr";
import { HiOutlineShare } from "react-icons/hi";
import Comment from '@/components/Comment'; 
import StarRating from '@/components/StarRating'; 
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

    useEffect(() => {
        const fetchProductDetails = async () => {
          try {
            const productData = await getProductDetails(productId);
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
    
        if (productId) {
          fetchProductDetails();
          fetchComments(); // Fetch comments for the product
        }
      }, [productId]);
    
      if (!product) {
        return <div className="loading-container">Loading...</div>;
      }

    const { image1, image2, image3, name, description, price, rating, attributes } = product;

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
    
    // const renderStars = (rating) => {
    //   const fullStars = Math.floor(rating); // Number of full stars
    //   const halfStar = rating % 1 >= 0.5; // Check if there's a half star
    //   const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Remaining empty stars

    //   return (
    //     <>
    //       {[...Array(fullStars)].map((_, index) => (
    //         <span key={`full-${index}`} className="star filled">★</span>
    //       ))}
    //       {halfStar && <span className="star half-filled">★</span>}
    //       {[...Array(emptyStars)].map((_, index) => (
    //         <span key={`empty-${index}`} className="star empty">★</span>
    //       ))}
    //     </>
    //   );
    // };

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
                
                <button className="buy-now-btn">Buy Now</button>
                <button className="wishlist-btn"><GrFavorite /></button>
              </div>
              
              <div className="additional-actions">
                <button className="add-to-cart-btn">Add to Cart</button>
                <button className="share-btn"><HiOutlineShare /></button>
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
        </div>
      );
    };
    
    export default ViewProduct;