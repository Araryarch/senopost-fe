import { BottomNav } from '@/components/bottom-nav'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import React from 'react'

export default function Layouts({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 px-4 pb-20 lg:pb-4 overflow-y-auto scrollbar-hide">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
