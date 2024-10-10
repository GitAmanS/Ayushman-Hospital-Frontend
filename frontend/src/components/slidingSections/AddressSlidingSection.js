import React, { useState, useContext } from "react";
import { MaterialSymbolsClose } from "../icons/MaterialSymbolsClose";
import { UserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";

const AddressSlidingSection = ({ isOpen, toggleSlide, initiateRazorpayPayment }) => {
  const { addresses, selectedAddress, setSelectedAddress } = useContext(UserContext); // Access cart data from UserContext

  const handleAddressSelect = (address) => {
    setSelectedAddress(address); // Set the selected address
    
  };
  const navigate = useNavigate();

  const navigateTo=(address)=>{
    navigate(address)
  }
  const handleContinuePayment = ()=>{
    initiateRazorpayPayment();
    toggleSlide();
  }
  return (
    <div className="md:flex md:flex-row md:justify-center md:items-center">
      {/* Background overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-500 ease-in-out ${
          isOpen ? "opacity-80" : "opacity-0 pointer-events-none"
        } z-40`}
        onClick={toggleSlide}
      ></div>

      {/* Sliding section for address */}
      <div
        className={`fixed bottom-0  md:w-fit w-full rounded-t-2xl bg-white md:h-[75%] h-[65%]  shadow-lg transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } z-50`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold">Select Address</h2>
          <MaterialSymbolsClose className="cursor-pointer" onClick={toggleSlide} />
        </div>

        {/* Scrollable addresses with hidden scrollbar */}
        <div className="p-4 space-y-4 overflow-y-auto h-[60%] scrollbar-hide">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div
                key={address._id}
                className={`p-2 border rounded-lg cursor-pointer ${
                  selectedAddress && selectedAddress._id === address._id ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => handleAddressSelect(address)}
              >
                <h1 className='text-sm font-bold'> {address.patientName}</h1>
                <p className="text-sm">{address.addressDetails} - {address.pincode}</p>

              </div>
            ))
          ) : (
            <p>No addresses found. Please add an address.</p>
          )}
        </div>

        <button
                onClick={() => navigateTo("/addressbook")} // Open the modal
                className=" font-semibold text-xl text-blue-500 w-full py-2 rounded "
            >
                + Add a new address
            </button>

        <div className="w-full flex justify-center ">
            <button 
            onClick={handleContinuePayment}
            className={`bg-red-500 mx-auto text-white px-24 my-8 py-2 rounded    ` }
        >
            Continue Payment
        </button>
            </div>
      </div>
    </div>
  );
};

export default AddressSlidingSection;