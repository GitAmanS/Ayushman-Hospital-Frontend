import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-stone-50 text-black mt-14">
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-8 justify-center py-12 gap-4'>
        <div className='px-4'>
          <h1 className='py-4 font-bold'>Know Us</h1>
          <ul className='text-xs text-stone-600 space-y-1'>
            <li><a href="#" className="">About Us</a></li>
            <li><a href="#" className="">Contact Us</a></li>
            <li><a href="#" className="">Press Coverage</a></li>
            <li><a href="#" className="">Careers</a></li>
            <li><a href="#" className="">Business Partnership</a></li>
            <li><a href="#" className="">Become a Health Partner</a></li>
          </ul>
        </div>

        <div className='px-4'>
          <h1 className='py-4 font-bold'>Our Policies</h1>
          <ul className='text-xs text-stone-600 space-y-1'>
            <li><a href="#" className="">Privacy Policy</a></li>
            <li><a href="#" className="">Terms and Conditions</a></li>
            <li><a href="#" className="">Editorial Policy</a></li>
            <li><a href="#" className="">Return Policy</a></li>
            <li><a href="#" className="">IP Policy</a></li>
            <li><a href="#" className="">Fraud Disclaimer</a></li>
          </ul>
        </div>

        <div className='px-4'>
          <h1 className='py-4 font-bold'>Our Services</h1>
          <ul className='text-xs text-stone-600 space-y-1'>
            <li><a href="#" className="">Book Lab Tests</a></li>
            <li><a href="#" className="">Pay for test</a></li>
            <li><a href="#" className="">Consult a doctor</a></li>
            <li><a href="#" className="">Care plan</a></li>
          </ul>
        </div>

        <div className='px-4'>
          <h1 className='py-4 font-bold'>Connect</h1>
          <h1 className='text-sm'>Social Links</h1>
          <ul className='flex flex-row flex-wrap space-x-4 mt-2'>
            <li>
              <a href="#" className="hover:opacity-80">
                <img src="/facebook.png" alt="Facebook" className="w-6 h-6 inline"/>
              </a>
            </li>
            <li>
              <a href="#" className="hover:opacity-80">
                <img src="/instagram.png" alt="Instagram" className="w-6 h-6 inline"/>
              </a>
            </li>
            <li>
              <a href="#" className="hover:opacity-80">
                <img src="/twitter.png" alt="Twitter" className="w-6 h-6 inline"/>
              </a>
            </li>
            <li>
              <a href="#" className="hover:opacity-80">
                <img src="/youtube.png" alt="YouTube" className="w-6 h-6 inline"/>
              </a>
            </li>
            <li>
              <a href="#" className="hover:opacity-80">
                <img src="/linkedin.png" alt="LinkedIn" className="w-6 h-6 inline"/>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className='flex items-center justify-center py-8 text-sm text-center font-bold text-gray-400 border-t'>
        <h1>
          © 2024 Ayushman Hospital. All rights reserved. All medicines are dispensed in compliance with the Drugs and Cosmetics Act, 1940 and Drugs and Cosmetics Rules, 1945. We do not process requests for Schedule X and habit forming drugs.
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
