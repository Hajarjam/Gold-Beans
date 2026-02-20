import React, { useState } from 'react'
import { MenuUser } from '../../components/layouts/user/MenuUser'
import ClientMainDash from '../../components/layouts/user/ClientMainDash'

const ClientDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-peach-light">
      <MenuUser sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:ml-72">
        <ClientMainDash />
      </div>
    </div>
  )
};

export default ClientDashboard;
