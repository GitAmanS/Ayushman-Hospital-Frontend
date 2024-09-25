import React, { useContext, useEffect, useState } from 'react'
import { SlArrowRight } from "react-icons/sl";
import { RiArrowRightWideLine } from "react-icons/ri";
import { SolarCart5BoldDuotone } from './icons/SolarCart5BoldDuotone';
import { FluentMdl2TestPlan } from './icons/FluentMdl2TestPlan';
import { Fa6SolidUserDoctor } from './icons/Fa6SolidUserDoctor';
import { MdiAddressMarkerOutline } from './icons/MdiAddressMarkerOutline';
import LoginSlidingSection from './slidingSections/LoginSlidingSection';
import { UserContext } from './Context/UserContext';
const Profile = () => {
    const {user} = useContext(UserContext)
    const [isSlidingOpen, setIsSlidingOpen] = useState(false);

    // Toggle the sliding section
    const toggleSlide = () => {
      setIsSlidingOpen(!isSlidingOpen);
    };


    useEffect(() => {
        // Lock or unlock scroll
        if (isSlidingOpen) {
          document.body.style.overflow = "hidden"; // Lock scroll
        } else {
          document.body.style.overflow = "auto"; // Unlock scroll
        }
    
        // Cleanup function to ensure scroll is reset
        return () => {
          document.body.style.overflow = "auto"; // Reset scroll
        };
      }, [isSlidingOpen]);
  return (
    <div className='flex flex-col pt-24'>
        <div className='p-4 border-b'>
            <h1 className='font-bold text-2xl'>Hi There!</h1>
            {user ? <p>View your profile</p>
            :<div>
                
            <p>Sign in to start your healthcare journy</p>
            <button onClick={toggleSlide} className='font-bold w-full px-auto mt-2  py-2 text-white bg-red-500 rounded-lg'>Sign in</button></div>}
        </div>

        <div className='flex flex-col justify-center border-b-8 border-gray-100 py-3'>
            <div className='flex flex-row px-4'>
                <div className='flex justify-center items-center mr-4 text-xl'>
                    <SolarCart5BoldDuotone/>
                </div>
                <h1 className='font-bold py-4'>
                    My orders
                </h1>
                <h1 className='flex justify-center ml-auto p-1 text-lg text-bold items-center'>
                    <RiArrowRightWideLine/>
                </h1>
            </div>


            <div className='flex flex-row px-4'>
                <div className='flex justify-center items-center mr-4 text-xl'>
                    <FluentMdl2TestPlan/>
                </div>
                <h1 className='font-bold py-4'>
                    My Lab Tests
                </h1>
                <h1 className='flex justify-center ml-auto p-1 text-lg text-bold items-center'>
                    <RiArrowRightWideLine/>
                </h1>
            </div>


            <div className='flex flex-row px-4'>
                <div className='flex justify-center items-center mr-4 text-xl'>
                    <Fa6SolidUserDoctor/>
                </div>
                <h1 className='font-bold py-4'>
                    My Consultations
                </h1>
                <h1 className='flex justify-center ml-auto p-1 text-lg text-bold items-center'>
                    <RiArrowRightWideLine/>
                </h1>
            </div>

            <div className='flex flex-row px-4'>
                <div className='flex justify-center items-center mr-4 text-xl'>
                    <MdiAddressMarkerOutline/>
                </div>
                <h1 className='font-bold py-4'>
                    Address book
                </h1>
                <h1 className='flex justify-center ml-auto p-1 text-lg text-bold items-center'>
                    <RiArrowRightWideLine/>
                </h1>
            </div>


        </div>

        <div className='flex flex-col justify-center border-b-8 border-gray-100 py-3'>
            <div className='flex flex-row px-4'>

                <h1 className='font-bold py-3'>
                    Contact Us
                </h1>
                <h1 className='flex justify-center ml-auto p-1 text-lg text-bold items-center'>
                    <RiArrowRightWideLine/>
                </h1>
            </div>


            <div className='flex flex-row px-4'>
                <h1 className='font-bold py-3'>
                    Need Help?
                </h1>
                <h1 className='flex justify-center ml-auto p-1 text-lg text-bold items-center'>
                    <RiArrowRightWideLine/>
                </h1>
            </div>


            <div className='flex flex-row px-4'>
                <h1 className='font-bold py-3'>
                    Privacy Policy
                </h1>
                <h1 className='flex justify-center ml-auto p-1 text-lg text-bold items-center'>
                    <RiArrowRightWideLine/>
                </h1>
            </div>

            <div className='flex flex-row px-4'>
                <h1 className='font-bold py-3'>
                    Refund Policy
                </h1>
                <h1 className='flex justify-center ml-auto p-1 text-lg text-bold items-center'>
                    <RiArrowRightWideLine/>
                </h1>
            </div>


            <div className='flex flex-row px-4'>
                <h1 className='font-bold py-3'>
                    Terms and conditions
                </h1>
                <h1 className='flex justify-center ml-auto p-1 text-lg text-bold items-center'>
                    <RiArrowRightWideLine/>
                </h1>
            </div>



            <div className='flex flex-row px-4'>
                <h1 className='font-bold py-3'>
                    Editorial Policy
                </h1>
                <h1 className='flex justify-center ml-auto p-1 text-lg text-bold items-center'>
                    <RiArrowRightWideLine/>
                </h1>
            </div>

            <LoginSlidingSection isOpen={isSlidingOpen} toggleSlide={toggleSlide} />
        </div>
    </div>
  )
}

export default Profile