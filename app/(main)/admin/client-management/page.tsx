import RoleDashboard from '@/components/admin/RoleDashboard'
import DashboardShell from '@/components/layout/DashboardShell'
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import React from 'react'

const page = () => {
  return (
    <DashboardShell>
      <div className=''>
        <RoleDashboard role="CLIENT" />
      </div>
    </DashboardShell>
  )
}

export default page