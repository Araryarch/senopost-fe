'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { UserNav } from './header-parts/user-nav'
import { AuthButtons } from './header-parts/auth-buttons'
import { SearchBar } from './header-parts/search-bar'

export function Header() {
  const { isAuthenticated, user } = useAuth()

  const sessionUser = user as
    | { image?: string; name?: string; email?: string }
    | undefined

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between h-12 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary hidden sm:block">
              SENOPOST
            </span>
          </Link>
        </div>

        <div className="flex-1 max-w-xl mx-4">
          <SearchBar />
        </div>

        {isAuthenticated ? <UserNav user={sessionUser} /> : <AuthButtons />}
      </div>
    </header>
  )
}
