import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

const AdminNavbar = () => {
  return (
    <div className='flex items-center justify-between px-6
    md:px-10 h-16 border-b border-gray-300/30'>
     <Link to="/" >
     <img src={assets.logo} alt="logo" className="w-32 md:w-40 lg:w-48 h-auto rounded-3xl border border-[#4D55CC]/30 transition" />
     </Link>
    </div>
  )
}

export default AdminNavbar
