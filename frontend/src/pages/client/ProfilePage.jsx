import React, { useState } from 'react'
import { MenuUser } from '../../components/layouts/user/MenuUser'
import ClientProfil from '../../components/layouts/user/ClientProfil'

const ProfilePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6EEE7] text-[#3B170D]">
      <MenuUser sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:ml-72 p-4 lg:p-5">
        <div className="rounded-3xl border border-[#EADFD7] bg-white shadow-sm min-h-[calc(100vh-2rem)]">
          <div className="p-4 sm:p-6">
            <ClientProfil />
          </div>
        </div>
      </div>
    </div>
  )
};

export default ProfilePage;
