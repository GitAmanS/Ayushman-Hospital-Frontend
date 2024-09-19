import React from 'react'
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
const BackButton = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
      navigate('/');
    };
  return (
    <button onClick={handleGoHome} className='bg-gray-100 p-3 rounded-full'><IoMdArrowRoundBack/></button>
  )
}

export default BackButton