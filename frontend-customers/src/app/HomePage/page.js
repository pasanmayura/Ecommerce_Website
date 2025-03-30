'use client';

import React, { useEffect, useState } from 'react';
import { Header } from "@/components/Header";
import Image from "next/image";
import Carousel from '@/components/Carousel';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import { getProductCards } from '@/services/productService';
import electronic from '@/images/Electronic.png'; 
import perfume from '@/images/perfume.png';
import foods from '@/images/foods.png';
import cosmatics from '@/images/cosmatics.png';
import footerTop from '@/images/footerTop.png';
import Divider from '@mui/material/Divider';
import Footer from '@/components/Footer';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(4); // Number of products to display initially
  const images = [
    '/images/carousel1.jpg',
    '/images/carousel2.jpg',
    '/images/carousel3.jpg',
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      const productData = await getProductCards();
      setProducts(productData);
    };

    fetchProducts();
  }, []);

  const handleViewMore = () => {
    setVisibleProducts((prevVisible) => prevVisible + 4); // Show 4 more products
  };

  return (
    <div className="common">
      <Header />
      <main className="main-content">
        <div className="content">
          <Carousel images={images} autoplay={true} interval={8000} showDots={true} />
          
          <div className="product-grid">
            {products.slice(0, visibleProducts).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {visibleProducts < products.length && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                onClick={handleViewMore} 
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#0A2F6E',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                View More
              </button>
            </div>
          )}

          <div className='Category-title' style={{color: '#0A2F6E', textAlign: 'center', marginTop: '50px', fontSize: '20px'}}>
            <h1>Browse By Category</h1>
          </div>

          <div className='category-grid'>                  
            <CategoryCard icon={electronic} title="Electronics" />
            <CategoryCard icon={perfume} title="Perfumes" />
            <CategoryCard icon={foods} title="Foods" />
            <CategoryCard icon={cosmatics} title="Cosmatics" />
          </div>

          <Divider variant="middle" />

          <div className='footerTop-img'>
            <center>
              <Image 
                src={footerTop} 
                alt="footerTop"
                style={{display:'flex', width:'80%', height:'auto', marginTop:'20px'}} />
              </center>
          </div>  
          
        </div>
        <Footer />
      </main>
      
    </div>
  );
};

export default HomePage;
