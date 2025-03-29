'use client';

import React, { useEffect, useState } from 'react';
import { Header } from "@/components/Header";
import Carousel from '@/components/Carousel';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import { getProductCards } from '@/services/productService';
import electronic from '@/images/Electronic.png'; 
import perfume from '@/images/perfume.png';
import foods from '@/images/foods.png';
import cosmatics from '@/images/cosmatics.png';

const HomePage = () => {
  const [products, setProducts] = useState([]);
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

  return (
    <div className="common">
      <Header />
      <main className="main-content">
        <div className="content">
          <Carousel images={images} autoplay={true} interval={8000} showDots={true} />
          
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className='Category-title' style={{color: '#0A2F6E', textAlign: 'center', marginTop: '50px', fontSize: '20px'}}>
            <h1>Browse By Category</h1>
          </div>

          <div className='category-grid'>                  
            <CategoryCard icon={electronic} title="Electronics" />
            <CategoryCard icon={perfume} title="Perfumes" />
            <CategoryCard icon={foods} title="Foods" />
            <CategoryCard icon={cosmatics} title="Cosmatics" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
