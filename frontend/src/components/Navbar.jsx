import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const {user} = useSelector(store => store.auth);
  return (
    <div>
      <div className='bg-white shadow-sm'>
        <div className='mx-auto px-4 py-2 flex justify-between items-center'>
            <Link to="/" className='flex items-center mr-5'>
            <span className='text-red-600 text-xl font-bold'>ChatterBox</span>
            </Link>

            <div className='flex items-center space-x-4 w-[200px]'>
                <Link to="/" className='text-gray-700 hover:text-gray-500'>Home</Link>
                <Link to="/chat" className='text-gray-700 hover:text-gray-500'>Chat</Link>
                <Link to={`/profile/${user?._id}`} className='w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xl text-gray-700'>
                  {user.username.slice(0, 1)}
                </Link>

            </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar;