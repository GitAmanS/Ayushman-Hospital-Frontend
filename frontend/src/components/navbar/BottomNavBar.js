import React, { useEffect, useState } from 'react'
import { UilHome } from '@iconscout/react-unicons'
import { UilMicroscope } from '@iconscout/react-unicons'
import { BiCategory } from "react-icons/bi";
import { UilUser } from '@iconscout/react-unicons'
import { UilListOlAlt } from '@iconscout/react-unicons'
import { useNavigate } from 'react-router-dom';
const BottomNavBar = () => {
  const navigate = useNavigate()
  const navigateTo = (address) => {
    navigate(address);
  };


  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Get scroll position
      const scrollY = window.scrollY;
      
      // Set a threshold of 100 pixels
      if (scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div className={`fixed bottom-0 left-0 right-0 text-black bg-white py-4 border-t border-gray-200 md:hidden transition-transform duration-500 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
    <nav className="flex justify-around text-sm px-2 items-end">
      <div onClick={()=>navigateTo("/")}  className="flex flex-col items-center">

          <UilHome/>

        <span className="text-xs">Home</span>
      </div>
      <div onClick={()=>navigateTo("/services")} className="flex flex-col items-center">

          <UilMicroscope/>
        <span className="text-xs">Services</span>
      </div>
      <div onClick={()=>navigateTo("/Categories")} className="flex flex-col items-center">
 
          <UilListOlAlt/>
   
        <span className="text-xs">Categories</span>
      </div>
      <div onClick={()=>navigateTo("/Profile")} className="flex flex-col items-center">

          <UilUser/>

        <span className="text-xs">Profile</span>
      </div>
    </nav>
  </div>
  )
}

export default BottomNavBar