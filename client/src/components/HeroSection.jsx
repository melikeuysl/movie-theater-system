import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
    
    const navigate = useNavigate()



  return (
    <div className='flex flex-col items-start justify-center gap-4
    px-6 md:px-16 lg:px-36 bg-[url("/backgroundImage.jpg")]
    bg-cover bg-center h-screen'>
      
      <h1 className='text-5xl md:text-[70px] ms:leading-18 font-semibold 
      max-w-110'>Dune<br /> Part Two</h1>


    <div className='flex items-center gap-4 text-gray-300'>
    <span> Adventure | Sci-fi  </span>

    <div className='flex items-center gap-1'>
        <CalendarIcon className='w-4.5 h-4.5' /> 2024
    </div>

    <div className='flex items-center gap-1'>
        <ClockIcon className='w-4.5 h-4.5' /> 2h 35m
    </div>
    </div>

     <p className='max-w-md text-gray-300'>The mythic journey of Paul Atreides as he unites with Chani and the 
        Fremen while on a path of revenge against the conspirators who destroyed his family.</p>

        <button onClick={()=> navigate('/movies')} className='flex items-center gap-1 px-6 py-3 text-sm bg-primary
        hover:bg-primary-dull transation rounded-full font-medium cursor-pointer'>
            Explore Movies
            <ArrowRight className='w-5 h-5' />
        </button>
    </div>
  )
}

export default HeroSection
