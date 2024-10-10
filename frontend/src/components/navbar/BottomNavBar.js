import React, { useEffect, useState } from 'react'
import { UilHome } from '@iconscout/react-unicons'
import { UilMicroscope } from '@iconscout/react-unicons'
import { BiCategory } from "react-icons/bi";
import { UilUser } from '@iconscout/react-unicons'
import { UilListOlAlt } from '@iconscout/react-unicons'
import { useLocation, useNavigate } from 'react-router-dom';
import { TablerHome } from '../icons/TablerHome';
import { TablerHomeFilled } from '../icons/TablerHomeFilled';
import { MingcuteMicroscopeLine } from '../icons/MingcuteMicroscopeLine';
import { MingcuteMicroscopeFill } from '../icons/MingcuteMicroscopeFill';
import { PhSquaresFourDuotone } from '../icons/PhSquaresFourDuotone';
import { PhSquaresFourFill } from '../icons/PhSquaresFourFill';
import { IconamoonProfileFill } from '../icons/IconamoonProfileFill';
import { IconamoonProfileDuotone } from '../icons/IconamoonProfileDuotone';
const BottomNavBar = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const navigateTo = (address) => {
    navigate(address);
    
  };


  const [isVisible, setIsVisible] = useState(true);

  const [activeTab, setActiveTab] = useState(location.pathname);

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


  useEffect(()=>{
    setActiveTab(location.pathname)
  }, [location.pathname])


  // const handleTabClick = (tabName) => {
  //   setActiveTab(tabName);
  // };
  return (
    <div className={`fixed bottom-0 z-30 left-0 right-0 text-black bg-white py-3 border-t border-gray-200 md:px-36 transition-transform duration-500 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
    <nav className="flex justify-around text-sm px-1 items-end">
      <div onClick={()=>navigateTo("/")}  className="flex flex-col items-center">

          {activeTab === "/"? <TablerHomeFilled/> : <TablerHome/>}

        <span className="text-xs">Home</span>
      </div>
      <div onClick={()=>navigateTo("/services")} className="flex flex-col items-center">

        {activeTab === "/services"? <MingcuteMicroscopeFill/> : <MingcuteMicroscopeLine/>}
        <span className="text-xs">Services</span>
      </div>
      <div onClick={()=>navigateTo("/categories")} className="flex flex-col items-center">
 
      {activeTab === "/categories"? <PhSquaresFourFill/> : <PhSquaresFourDuotone/>}
   
        <span className="text-xs">Categories</span>
      </div>
      <div onClick={()=>navigateTo("/profile")} className="flex flex-col items-center">

        {activeTab === "/profile"? <IconamoonProfileFill/> : <IconamoonProfileDuotone/>}
        <span className="text-xs">Profile</span>
      </div>
    </nav>
  </div>
  )
}

export default BottomNavBar