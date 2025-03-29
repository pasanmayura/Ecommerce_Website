'use client';

import React from 'react';
import Image from 'next/image';
import '@/styles/CategoryCard.css';

const CategoryCard = ({ icon, title }) => {
  return (
    <div className="category-card">
      <div className="category-icon">
        {/* Check if the icon is an object (image) or a React component */}
        {typeof icon === 'object' && icon.src ? (
          <Image src={icon} alt={title} width={50} height={50} />
        ) : (
          icon
        )}
      </div>
      <h3 className="category-title">{title}</h3>
    </div>
  );
};

export default CategoryCard;