import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";

const BackButton = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
      navigate(-1);  // Go back to the previous page
    };

    return (
      <button onClick={handleGoBack} className='bg-gray-100 p-3 rounded-full'>
        <IoMdArrowRoundBack />
      </button>
    );
}

export default BackButton;
