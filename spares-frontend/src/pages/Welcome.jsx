import React from 'react';
import './Pages.css';

const Welcome = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">Welcome to JJ's Automotive Supplies</h1>
      <p className="page-subtitle">Your trusted partner for spares, towing, and bodywork.</p>
      
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <img 
          src="/assets/jjs-hero-banner.jpg" 
          alt="JJ's Automotive Garage" 
          style={{ width: '100%', maxWidth: '900px', border: '1px solid #9a8f8c', marginBottom: '2rem' }} 
        />
        <br />
        {/* Reusing the button class from Navbar.css */}
        <button className="btn-action">Explore Our Services</button>
      </div>
    </div>
  );
};

export default Welcome;