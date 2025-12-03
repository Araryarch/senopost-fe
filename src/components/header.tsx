'use client'

import Link from 'next/link'
import {
  Search,
  Bell,
  Plus,
  ChevronDown,
  Menu,
  Moon,
  Sun,
  Bot,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTheme } from 'next-themes'
import { useAuth } from '@/hooks/use-auth'
import { LogoutButton } from '@/components/logout-button'

export function Header() {
  const { isAuthenticated, user } = useAuth()
  const { theme, setTheme } = useTheme()
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search senopost"
              className="pl-10 bg-secondary border-none h-9 rounded-full focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-1">
          {isAuthenticated ? (
            <>
              <Link href="/submit">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex gap-1 rounded-full hover:bg-secondary"
                >
                  <Plus className="h-4 w-4" />
                  Create
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-secondary hidden sm:flex"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Link href="/chat">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-secondary hidden sm:flex"
                >
                  <Bot className="h-5 w-5" />
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2 rounded-full hover:bg-secondary"
                  >
                    <Avatar className="h-7 w-7">
                      {sessionUser?.image ? (
                        <AvatarImage src={sessionUser.image} />
                      ) : (
                        <AvatarImage src="/diverse-avatars.png" />
                      )}
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {sessionUser?.name?.[0] ??
                          sessionUser?.email?.[0] ??
                          'U'}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/user">View Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings/profile">User Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      setTheme(theme === 'dark' ? 'light' : 'dark')
                    }
                  >
                    {theme === 'dark' ? (
                      <span className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light Mode
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark Mode
                      </span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogoutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-transparent"
                >
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="rounded-full bg-primary hover:bg-primary/90"
                >
                  Sign Up
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="sm:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
