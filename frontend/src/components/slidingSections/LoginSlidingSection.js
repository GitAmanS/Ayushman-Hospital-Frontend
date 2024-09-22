import React, { useState, useRef } from "react";
import { MaterialSymbolsClose } from "../icons/MaterialSymbolsClose";
import { Link } from "react-router-dom";

const OTPInput = ({ length = 6, value, onChange }) => {
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const { value } = e.target;

    // Only allow single digit input
    if (value.match(/^\d$/)) {
      const newOtp = [...value];
      newOtp[index] = value;
      onChange(newOtp.join(""));

      // Move focus to the next input
      if (index < length - 1) {
        inputs.current[index + 1].focus();
      }
    }

    // Move focus to previous input on backspace
    if (value === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && value[index] === "") {
      // Move focus to previous input on backspace if current input is empty
      if (index > 0) {
        inputs.current[index - 1].focus();
      }
    }
  };

  return (
    <div className="flex justify-center space-x-2 mb-4">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={value[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputs.current[index] = el)}
          className="w-10 h-10 border border-gray-300 rounded-lg text-center text-sm focus:border-blue-500 focus:outline-none"
        />
      ))}
    </div>
  );
};

const LoginSlidingSection = ({ isOpen, toggleSlide }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(""); // New state for email
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false); // New state to track OTP verification

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  const handleGetVerificationCode = () => {
    setIsOtpSent(true);
  };

  const handleVerifyOtp = () => {
    // Add logic to verify OTP here
    setIsOtpVerified(true);
  };

  const handleChangeNumber = () => {
    setIsOtpSent(false);
    setPhoneNumber("");
    setOtp("");
  };

  const handleSubmitEmail = () => {
    // Handle email submission logic here
    console.log("Email submitted:", email);
    toggleSlide(); // Close the sliding section after submission
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-500 ease-in-out ${
          isOpen ? "opacity-80" : "opacity-0 pointer-events-none"
        } z-40`}
        onClick={toggleSlide}
      ></div>

      <div
        className={`fixed bottom-0 left-0 w-full rounded-t-2xl bg-white h-[45%] shadow-lg transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } z-50`}
      >
        <div className="px-4">
          {isOpen && (
            <button
              className="fixed top-[-50px] right-2 bg-white text-white p-1 rounded-full z-60"
              onClick={toggleSlide}
            >
              <MaterialSymbolsClose />
            </button>
          )}

          <h2 className="text-lg font-bold py-4">
            {isOtpSent ? (isOtpVerified ? "Submit Your Email" : "Enter Verification Code") : "Sign into your account"}
          </h2>

          <div className="relative">
            {isOtpSent ? (
              <>
                {isOtpVerified ? (
                  <>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="block w-full p-2.5 mb-4 text-base text-gray-900 bg-transparent border-2 rounded-xl focus:outline-none"
                    />
                    <button 
                      className="w-full mt-4 py-3 rounded-lg font-bold text-white px-4 bg-red-500"
                      onClick={handleSubmitEmail}
                    >
                      Submit Email
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-center mb-4">
                      A 6-digit code has been sent to +91 {phoneNumber}
                    </p>
                    <OTPInput length={6} value={otp} onChange={setOtp} />
                    <button
                      className="w-full mt-4 py-3 rounded-lg font-bold text-white px-4 bg-red-500"
                      onClick={handleVerifyOtp} // Verify OTP
                    >
                      Continue
                    </button>
                    <p className="text-center mb-1">
                      <button
                        className="underline text-blue-600"
                        onClick={handleChangeNumber}
                      >
                        Change Number
                      </button>
                    </p>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="relative w-full">
                  <span className="absolute left-3 top-4 text-sm text-gray-500">+91</span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handleChange}
                    className="block pl-10 py-2.5 w-full text-base text-gray-900 bg-transparent rounded-xl border-2 focus:outline-none peer"
                    placeholder=" "
                    maxLength="10"
                  />
                </div>
                <label className="absolute pointer-events-none text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2">
                  Enter 10 Digit Mobile Number
                </label>
                <button
                  className="w-full mt-8 py-3 rounded-lg font-bold text-white px-4 bg-red-500"
                  onClick={handleGetVerificationCode}
                >
                  Get Verification Code
                </button>
              </>
            )}
          </div>

          <p className="text-center mt-2">
            By signing in you agree to our <br />
            <Link to="/terms" className="underline text-blue-600 hover:text-blue-800">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline text-blue-600 hover:text-blue-800">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginSlidingSection;
