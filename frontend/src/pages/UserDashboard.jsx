import React, { useState } from 'react'
import { MenuUser } from '../components/layouts/MenuUser'
import MainDash from '../components/layouts/MainDash'

export const UserDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
    
          <div className="hidden lg:block w-72">
            <MenuUser sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </div>
          {/* Mobile sidebar */}
          {sidebarOpen && (
            <div className="lg:hidden w-72">
              <MenuUser sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            </div>
          )}
          <div className="flex-1">
            <MainDash sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </div>
    
        </div>
  )
}
