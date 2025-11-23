import React from 'react';
import './CenteredLoader.css';

const CenteredLoader = ({ message = "Loading..." }) => {
  return (
    <div className="centered-loader-overlay">
      <div className="centered-loader-content">
        <div className="spinner-loader">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <p className="loader-text">{message}</p>
      </div>
    </div>
  );
};

export default CenteredLoader;
