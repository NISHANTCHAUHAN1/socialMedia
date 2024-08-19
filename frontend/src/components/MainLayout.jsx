import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'
import Navbar from './Navbar'

const MainLayout = () => {
  return (
    <div>
       <Navbar />
       <LeftSidebar />
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
