import React from 'react';
import PropTypes from 'prop-types';
import '@/styles/LoadingComponent.css';

const LoadingComponent = ({ message = 'Loading, please wait...' }) => {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

LoadingComponent.propTypes = {
  message: PropTypes.string, // Optional custom loading message
};

export default LoadingComponent;