import React, { useState } from 'react'
import { MenuUser } from '../../components/layouts/user/MenuUser'
import ClientProfil from '../../components/layouts/user/ClientProfil'

const ProfilePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-peach-light">
      <MenuUser sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:ml-72">
        <ClientProfil />
      </div>
    </div>
  )
};

export default ProfilePage;
