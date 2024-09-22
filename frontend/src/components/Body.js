import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Body = ({ element, showFooter = true }) => {
  return (
    <div>
      <Header />
      {element}
      {showFooter && <Footer />} {/* Render footer only if showFooter is true */}
    </div>
  );
};

export default Body;
