import React from 'react'
import Header from './Header'
import Footer from './Footer'

const Body = ({element}) => {
  return (
    <div>
        <Header/>
        {element}
        <Footer/>
    </div>
  )
}

export default Body