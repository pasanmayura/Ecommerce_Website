'use client';

import React from 'react';
import { Header } from "@/components/Header";
import  Carousel  from '@/components/Carousel'; 


const HomePage = () => {  
    const images = [
        '/images/carousel1.jpg',
        '/images/carousel2.jpg',
        '/images/carousel3.jpg'
      ];

    return (
        <div className="common">
            <Header />
            <main className="main-content">            
                <div className="content">
                <Carousel 
            images={images} 
            autoplay={true} 
            interval={6000} 
            showDots={true} 
          />
                </div>
            </main>  
            
        </div>
    );
};

export default HomePage;
