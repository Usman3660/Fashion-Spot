// src/components/HeroBanner.js

import React from 'react';
import '../styles/hero.css';

const HeroBanner = () => {
  return (
    <div
      className="hero-banner"
      style={{
        backgroundImage: "url('/images/fashion-bg.jpg')"
      }}
    >
      <h1>Welcome to Fashion Spot</h1>
      <p>Discover the latest trends and timeless classics</p>
      <button>Shop Now</button>
    </div>
  );
};

export default HeroBanner;
