import React from 'react'
import about from "../../assets/about/abou2.jpg"

const AboutBanner = () => {
  return (
    <div className='w-full h-[200px] sm:h-[300px] lg:h-[500PX]'>
        <img className='w-full h-full object-cover object-center' src={about}/>
    </div>
  )
}

export default AboutBanner