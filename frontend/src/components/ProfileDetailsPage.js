import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IcBaselinePhone } from './icons/IcBaselinePhone';
import { MageEmailFill } from './icons/MageEmailFill';
import { UserContext } from './Context/UserContext';
import axios from 'axios'; // Ensure axios is installed and imported

const ProfileDetailsPage = () => {
    const navigate = useNavigate();
    const { logout, user, submitEmailF } = useContext(UserContext);

    // State to handle modal visibility and input values
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');

    // States for OTP functionality
    const [newPhone, setNewPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // Step to track the flow (1: Request OTP, 2: Verify OTP)
    const [otpMessage, setOtpMessage] = useState('');
    const [phoneError, setPhoneError] = useState(''); // To handle phone number validation error

    // If user is not available, redirect or handle loading state
    if (!user) {
        return <div>Loading...</div>; // Or navigate to a different page, e.g., navigate('/login');
    }

    // Initialize phone number and email once user is defined
    if (phoneNumber === '' && email === '') {
        setPhoneNumber(user.phone);
        setEmail(user.email);
    }

    const handlePhoneEdit = () => {
        setNewPhone(phoneNumber); // Set current phone number for editing
        setShowPhoneModal(true);
        setOtpMessage(''); // Reset OTP message
        setPhoneError(''); // Reset phone validation error
    };

    const handleEmailEdit = () => {
        setShowEmailModal(true);
    };

    const handlePhoneSave = () => {
        setShowPhoneModal(false); // Close the modal after saving
    };

    const handleEmailSave = () => {
        submitEmailF(email);
        setShowEmailModal(false); // Close the modal after saving
    };

    const requestOtp = async () => {
        if (newPhone.length !== 10) {  // Change this length based on your country/validation rule
            setPhoneError('Phone number must be 10 digits.');
            return;
        }
        try {
            const response = await axios.post('/api/auth/request-update-phone-otp', { newPhone });
            console.log(response.data)
            setStep(2); // Move to OTP verification step
        } catch (error) {
            setOtpMessage(error.response.data || 'Failed to send OTP. Please try again.');
        }
    };

    const verifyOtp = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/verify-update-phone-otp', { newPhone, otp });
            setOtpMessage(response.data.message);
            if (response.data.success) {
                setPhoneNumber(newPhone); // Update phone number in state if verification is successful
                setShowPhoneModal(false); // Close the modal
            }
        } catch (error) {
            setOtpMessage(error.response.data || 'Failed to verify OTP. Please try again.');
        }
    };

    const date = new Date(user.joinedAt);
    const options = { year: 'numeric', month: 'long' };
    const formattedDate = date.toLocaleString('en-US', options);

    return (
        <div className='mt-24'>
            <div className='p-4 border-b'>
                <h1 className='font-bold text-2xl'>Hi There!</h1>
                <p>Joined in {formattedDate}</p>
                <button onClick={logout} className='font-bold w-full px-auto mt-2 py-2 text-white bg-red-500 rounded-lg'>Log out</button>
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

{showPhoneModal && (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
        <div className='bg-white p-6 rounded-md'>
            <h1 className='font-bold text-xl mb-4'>Edit Phone Number</h1>
            {step === 1 && (
                <>
                    <input 
                        type="text" 
                        className='border p-2 w-full mb-4' 
                        value={newPhone} 
                        onChange={(e) => setNewPhone(e.target.value)} 
                        placeholder="Enter new phone number"
                    />
                    {phoneError && <p className='text-red-500'>{phoneError}</p>}
                    <button 
                        onClick={requestOtp} 
                        className='bg-blue-500 text-white px-4 py-2 rounded-md'>
                        Request OTP
                    </button>
                </>
            )}
            {step === 2 && (
                <>
                    <input 
                        type="text" 
                        className='border p-2 w-full mb-4' 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        placeholder="Enter OTP"
                    />
                    <button 
                        onClick={verifyOtp} 
                        className='bg-blue-500 text-white px-4 py-2 rounded-md'>
                        Verify OTP
                    </button>
                </>
            )}
            {/* Remove this line to stop rendering the otpMessage */}
            {/* {otpMessage && <p className='text-red-500 mt-2'>{otpMessage}</p>} */}
            <button 
                onClick={() => setShowPhoneModal(false)} 
                className='text-gray-500 mt-4'>
                Cancel
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
