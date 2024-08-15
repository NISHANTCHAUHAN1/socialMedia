import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetPosts from '@/hooks/useGetPosts'
import useGetSuggestUser from '@/hooks/useGetSuggestUser'

const Home = () => {
  useGetPosts();
  useGetSuggestUser();
  return (
    <div className='flex'>
       <div className='flex-grow'>
          <Feed />
          <Outlet />
       </div>
       <RightSidebar />
    </div>
  )
}

export default Home
