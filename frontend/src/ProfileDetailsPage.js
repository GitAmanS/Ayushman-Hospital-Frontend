import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IcBaselinePhone } from './components/icons/IcBaselinePhone';
import { MageEmailFill } from './components/icons/MageEmailFill';
import { UserContext } from './components/Context/UserContext';

const ProfileDetailsPage = () => {
    const navigate = useNavigate();
    const {logout} = useContext(UserContext)
    // State to handle modal visibility and input values
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('9529575726');
    const [email, setEmail] = useState('amanshaikh8624@gmail.com');

    const handlePhoneEdit = () => {
        setShowPhoneModal(true);
    };

    const handleEmailEdit = () => {
        setShowEmailModal(true);
    };

    const handlePhoneSave = () => {
        setShowPhoneModal(false); // Close the modal after saving
    };

    const handleEmailSave = () => {
        setShowEmailModal(false); // Close the modal after saving
    };

    return (
      <div className='mt-24'>
        <div className='p-4 border-b'>
            <h1 className='font-bold text-2xl'>Hi There!</h1>
            <p>Joined in</p>
            <button onClick={()=>{logout()}} className='font-bold w-full px-auto mt-2  py-2 text-white bg-red-500 rounded-lg'>Log out</button>
        </div>
        <div className='py-4 px-4 border-b'>
            <h1 className='font-bold text-xl'>Details</h1>
            
            {/* Phone Number Section */}
            <div className='flex flex-row py-3 items-center'>
                <div className='px-4'>
                    <IcBaselinePhone />
                </div>
                <div className='flex flex-col'>
                    <h1>Mobile Number</h1>
                    <h1>{phoneNumber}</h1>
                </div>
                <button onClick={handlePhoneEdit} className='font-bold text-xl text-red-500 ml-auto'>
                    Edit
                </button>
            </div>

            {/* Email Section */}
            <div className='flex flex-row py-3 items-center'>
                <div className='px-4'>
                    <MageEmailFill />
                </div>
                <div className='flex flex-col'>
                    <h1>Email Address</h1>
                    <h1>{email}</h1>
                </div>
                <button onClick={handleEmailEdit} className='font-bold text-xl text-red-500 ml-auto'>
                    Edit
                </button>
            </div>
        </div>

        {/* Phone Number Modal */}
        {showPhoneModal && (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                <div className='bg-white p-6 rounded-md'>
                    <h1 className='font-bold text-xl mb-4'>Edit Phone Number</h1>
                    <input 
                        type="text" 
                        className='border p-2 w-full mb-4' 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                    />
                    <button 
                        onClick={handlePhoneSave} 
                        className='bg-blue-500 text-white px-4 py-2 rounded-md'>
                        Save
                    </button>
                </div>
            </div>
        )}

        {/* Email Modal */}
        {showEmailModal && (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                <div className='bg-white p-6 rounded-md'>
                    <h1 className='font-bold text-xl mb-4'>Edit Email Address</h1>
                    <input 
                        type="text" 
                        className='border p-2 w-full mb-4' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <button 
                        onClick={handleEmailSave} 
                        className='bg-blue-500 text-white px-4 py-2 rounded-md'>
                        Save
                    </button>
                </div>
            </div>
        )}
      </div>
    );
};

export default ProfileDetailsPage;
