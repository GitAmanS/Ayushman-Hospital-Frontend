import React from 'react'

const Profile = () => {
  return (
    <div className='flex flex-col pt-24'>
        <div className='p-4 border-b'>
            <h1 className='font-bold text-2xl'>Hi There!</h1>
            <p>Sign in to start your healthcare journy</p>
            <button className='font-bold w-full px-auto mt-2  py-2 text-white bg-red-500 rounded-lg'>Sign in</button>
        </div>

        <div className='flex flex-col'>
            <div className='flex flex-row'>
                <div>

                </div>
                <h1 className='font-bold px-4 py-4'>
                    My orders
                </h1>
            </div>
        </div>
    </div>
  )
}

export default Profile