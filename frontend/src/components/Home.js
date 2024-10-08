import React from 'react'
import Categories from './Categories'
import BannerImages from './BannerImages'
import MostBookedServices from './MostBookedServices'

const Home = () => {
  return (
    <div className='mt-20'>
        <BannerImages/>
        <Categories/>
        <MostBookedServices/>
    </div>
  )
}

export default Home