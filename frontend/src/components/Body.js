import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import {useLocation} from "react-router-dom";

const Body = ({ element, showFooter = true }) => {

  const { pathname } = useLocation();

  
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when route changes
  }, [pathname]);
  return (
    <div>
      <Header showFooter={showFooter}/>
      {element}
      {showFooter && <Footer />} {/* Render footer only if showFooter is true */}
    </div>
  );
};

export default Body;
