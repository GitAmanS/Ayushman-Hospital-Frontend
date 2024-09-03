import React from 'react';
import { IoMdArrowDropdown } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

const Header = () => {
  return (
    <header className="bg-white text-black open-sans">
      <div className="container mx-auto flex flex-col  md:flex-row justify-between items-center p-2 border-b">
        <h1 className="text-lg font-bold flex flex-col p-2 text-center md:text-left"> 
            <span style={{ marginBottom: "-8px" }}>Ayushman</span>
            <span>Hospital</span>
            <div className="bg-sky-900 h-2"></div>
        </h1>

        <div className="flex items-center w-full max-w-lg md:max-w-xl bg-neutral-100 px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold my-2 md:my-0 mx-auto md:mx-4">
            <CiSearch className="text-gray-500 mr-2 text-xl" />
            <input
                type="text"
                placeholder="Search for lab tests"
                className="flex-grow bg-transparent outline-none"
            />
        </div>

        <div className="flex flex-row text-sm space-x-4 whitespace-nowrap">
            <h1>Login</h1>
            <div className="border-l border-gray-300 h-6 mx-4"></div>
            <h1>Sign up</h1>
        </div>

        <div className="px-4 md:px-8 mt-2 md:mt-0">
            <FaCartPlus className="text-2xl" />
        </div>
      </div>

      <nav>
        <ul className="flex flex-wrap justify-center text-sm font-semibold  py-4 items-center space-x-4 md:space-x-8">
            <li className="group relative my-2">
            <a href="#home" className="hover:text-gray-300">ECG</a>
            <ul className="absolute z-10 hidden group-hover:block bg-white shadow-lg text-left text-xs whitespace-nowrap">
                <h1 className='px-2'><IoMdArrowDropdown /></h1>
                <li><a href="#ecg1" className="block px-4 py-2 hover:bg-gray-100 ">12-Lead ECG</a></li>
                <li><a href="#ecg2" className="block px-4 py-2 hover:bg-gray-100">Holter Monitoring</a></li>
                <li><a href="#ecg3" className="block px-4 py-2 hover:bg-gray-100">Stress Test ECG</a></li>
            </ul>
            </li>


            <li className="group relative my-2">
            <a href="#home" className="hover:text-gray-300">Pathology Tests</a>
            <ul className="absolute z-10 hidden group-hover:block bg-white shadow-lg text-left text-xs whitespace-nowrap">
                <h1 className='px-2'><IoMdArrowDropdown /></h1>
                <li><a href="#ecg1" className="block px-4 py-2 hover:bg-gray-100 ">Histopathology</a></li>
                <li><a href="#ecg2" className="block px-4 py-2 hover:bg-gray-100">Clinical Chemistry</a></li>
                <li><a href="#ecg3" className="block px-4 py-2 hover:bg-gray-100">Microbiology</a></li>
            </ul>
            </li>



            <li className="group relative my-2">
            <a href="#home" className="hover:text-gray-300">X-ray Tests</a>
            <ul className="absolute z-10 hidden group-hover:block bg-white shadow-lg text-left text-xs whitespace-nowrap">
                <h1 className='px-2'><IoMdArrowDropdown /></h1>
                <li><a href="#ecg1" className="block px-4 py-2 hover:bg-gray-100 ">Chest X-ray</a></li>
                <li><a href="#ecg2" className="block px-4 py-2 hover:bg-gray-100">Abdominal X-ray</a></li>
                <li><a href="#ecg3" className="block px-4 py-2 hover:bg-gray-100">Skeletal X-ray</a></li>
                <li><a href="#ecg3" className="block px-4 py-2 hover:bg-gray-100">Mammography (Breast X-ray)</a></li>
            </ul>
            </li>



            <li className="group relative my-2">
            <a href="#home" className="hover:text-gray-300">Urinalysis</a>
            <ul className="absolute z-10 hidden group-hover:block bg-white shadow-lg text-left text-xs whitespace-nowrap">
                <h1 className='px-2'><IoMdArrowDropdown /></h1>
                <li><a href="#ecg1" className="block px-4 py-2 hover:bg-gray-100 ">Macroscopic Analysis</a></li>
                <li><a href="#ecg2" className="block px-4 py-2 hover:bg-gray-100">Chemical Analysis</a></li>
                <li><a href="#ecg3" className="block px-4 py-2 hover:bg-gray-100">Microscopic Analysis</a></li>
            </ul>
            </li>



            <li className="group relative my-2">
            <a href="#home" className="hover:text-gray-300">Immunology and Serology Tests</a>
            <ul className="absolute z-10 hidden group-hover:block bg-white shadow-lg text-left text-xs whitespace-nowrap">
                <h1 className='px-2'><IoMdArrowDropdown /></h1>
                <li><a href="#ecg1" className="block px-4 py-2 hover:bg-gray-100 ">HIV Antibody Test</a></li>
                <li><a href="#ecg2" className="block px-4 py-2 hover:bg-gray-100">Autoimmune Panel</a></li>
                <li><a href="#ecg3" className="block px-4 py-2 hover:bg-gray-100">Allergy Tests</a></li>
            </ul>
            </li>
            <li className="group relative my-2">
            <a href="#home" className="hover:text-gray-300">Advanced Imaging Techniques</a>
            <ul className="absolute z-10 hidden group-hover:block bg-white shadow-lg text-left text-xs whitespace-nowrap">
                <h1 className='px-2'><IoMdArrowDropdown /></h1>
                <li><a href="#ecg1" className="block px-4 py-2 hover:bg-gray-100 ">Computed Tomography (CT) Scan</a></li>
                <li><a href="#ecg2" className="block px-4 py-2 hover:bg-gray-100">Ultrasound</a></li>
                <li><a href="#ecg3" className="block px-4 py-2 hover:bg-gray-100">Nuclear Medicine Scans</a></li>
            </ul>
            </li>
          
        </ul>
      </nav>
    </header>
  );
}

export default Header;
