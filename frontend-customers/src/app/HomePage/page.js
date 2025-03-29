'use client';

import React, { useEffect, useState } from 'react';
import { Header } from "@/components/Header";
import Carousel from '@/components/Carousel';
import ProductCard from '@/components/ProductCard';
import { getProductCards } from '@/services/productService';

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
        </div>
      </main>
    </div>
  );
};

export default HomePage;
