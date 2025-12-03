'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Flame, Plus, Bell, User, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Flame, label: 'Popular', href: '/r/popular' },
  { icon: Plus, label: 'Create', href: '/submit' },
  { icon: Bot, label: 'Chat', href: '/chat' },
  { icon: Bell, label: 'Inbox', href: '/notifications' },
  { icon: User, label: 'Profile', href: '/user' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border lg:hidden">
      <div className="flex items-center justify-around h-14 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 w-full h-full text-muted-foreground transition-colors',
                isActive && 'text-primary',
              )}
            >
              <item.icon
                className={cn('h-5 w-5', isActive && 'text-primary')}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
