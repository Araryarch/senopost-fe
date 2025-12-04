import { BottomNav } from '@/components/bottom-nav'
import { Header } from '@/components/header'
import { RightSidebar } from '@/components/right-sidebar'
import { Sidebar } from '@/components/sidebar'
import React from 'react'

interface LayoutProps {
  children: React.ReactNode
  withHeader?: boolean
  withSidebar?: boolean
  withRightSidebar?: boolean
}

export default function Layouts({
  children,
  withHeader = true,
  withSidebar = true,
  withRightSidebar = true,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {withHeader && <Header />}
      <div className="flex">
        {withSidebar && <Sidebar />}
        <main
          className={`flex-1 min-w-0 p-4 pb-20 lg:pb-4 overflow-y-auto scrollbar-hide`}
        >
          {children}
        </main>

        {withRightSidebar && <RightSidebar />}
      </div>

      <BottomNav />
    </div>
  )
}
