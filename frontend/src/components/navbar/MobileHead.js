import React, { useState, useEffect } from 'react';
import { UilShoppingBag } from '@iconscout/react-unicons'
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../buttons/BackButton';

const MobileHeader = () => {
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation()
  const goToCartPage = () => {
    navigate('/cart');
  };
  // Detect scroll direction
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      // Scrolling down
      setIsScrollingUp(false);
    } else {
      // Scrolling up
      setIsScrollingUp(true);
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
<div className='open-sans'>
      {/* Navbar */}
      <div
        className={`fixed z-50 border-b top-0 py-4 left-0 right-0 bg-white text-black flex items-center justify-between px-4 transition-transform duration-300 ease-in-out ${
          isScrollingUp ? 'transform translate-y-0' : 'transform -translate-y-full'
        } md:hidden`}
      >
      {location.pathname === "/" ? (<h1 className="text-base md:text-lg font-bold flex flex-col text-left">
        <span style={{ marginBottom: '-4px' }}>AYUSHMAN</span>
        <span>HOSPITAL</span>
        <div className="bg-sky-900 h-1"></div>
      </h1>):(
        <BackButton/>
      )}
        <button onClick={goToCartPage} className="bg-gray-100 my-2 text-xs rounded-full p-2.5">
          <UilShoppingBag className="w-5 h-5"/>
        </button>
      </div>


    </div>
  );
};

export default MobileHeader;
