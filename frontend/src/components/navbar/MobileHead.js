import React, { useState, useEffect, useContext } from 'react';
import { UilShoppingBag } from '@iconscout/react-unicons'
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../buttons/BackButton';
import { SolarCart4BoldDuotone } from '../icons/SolarCart4BoldDuotone';
import { UserContext } from '../Context/UserContext';

const MobileHeader = () => {
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation()
  const { cartProducts } = useContext(UserContext);
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
        className={`fixed z-30 border-b top-0 py-3 left-0 right-0 bg-white text-black flex items-center justify-between px-4 transition-transform duration-300 ease-in-out ${
          isScrollingUp ? 'transform translate-y-0' : 'transform -translate-y-full'
        } md:hidden`}
      >
      {location.pathname === "/" ? (<h1 className="text-sm font-bold flex flex-col text-left">
        <span style={{ marginBottom: '-8px' }}>AYUSHMAN</span>
        <span>HOSPITAL</span>
        <div className="bg-sky-900 h-1"></div>
      </h1>):(
        <BackButton/>
      )}
      <div className="relative inline-block">
        <button
          onClick={goToCartPage}
          className="bg-gray-100 my-1 text-xs rounded-full p-2.5 relative"
        >
          <SolarCart4BoldDuotone className="w-5 h-5" />
        </button>

        {/* Badge */}
        {cartProducts.length > 0 && (
          <span className="absolute top-2 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
            {cartProducts.length}
          </span>
        )}
      </div>
      </div>


    </div>
  );
};

export default MobileHeader;
