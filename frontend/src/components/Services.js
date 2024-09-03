import React from 'react';

const Services = () => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:mx-20 gap-4 p-4">
        {/* Card 1 */}
        <div className="border rounded p-4 flex flex-col items-center max-w-max justify-center">
          <div className="flex items-center justify-center h-28">
            <img className='h-full object-cover' src='./Diabetes.webp' alt="Diabetes"/>
          </div>
          <div className="mt-4 text-center">
            <h1 className='font-semibold break-words'>Complete Blood Count</h1>
          </div>
          <div className="text-sm text-center">
            <h1 className=' break-words'>Complete Blood Count</h1>
          </div>
          <div className='flex items-center justify-between w-full mt-8'>
            <h1 className='font-bold text-xl'>₹399</h1>
            <button className='font-bold text-xl text-red-500'>Add</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Services;
