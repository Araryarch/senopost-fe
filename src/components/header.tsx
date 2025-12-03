'use client'

import Link from 'next/link'
import {
  Search,
  Bell,
  MessageSquare,
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
import { useState } from 'react'
import { useTheme } from 'next-themes'

export function Header() {
  const [isLoggedIn] = useState(true)
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between h-12 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <svg
                viewBox="0 0 20 20"
                className="w-5 h-5 text-primary-foreground fill-current"
              >
                <path d="M16.5 8.5c0-1.1-.9-2-2-2-.5 0-1 .2-1.4.5-1.3-.9-3-1.4-4.9-1.5l1-3.1 2.7.6c0 .8.6 1.5 1.5 1.5.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5c-.6 0-1.1.3-1.3.8L9.3 1.5c-.2 0-.3.1-.4.3l-1.2 3.7c-2 .1-3.8.6-5.2 1.5-.4-.3-.9-.5-1.4-.5-1.1 0-2 .9-2 2 0 .7.4 1.4 1 1.7-.1.3-.1.7-.1 1 0 3.3 3.8 6 8.5 6s8.5-2.7 8.5-6c0-.3 0-.7-.1-1 .6-.3 1-1 1-1.7zM5 11c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5-.7 1.5-1.5 1.5S5 11.8 5 11zm8.1 3.3c-1 1-2.5 1.2-3.6 1.2s-2.6-.2-3.6-1.2c-.2-.2-.2-.5 0-.7.2-.2.5-.2.7 0 .7.7 1.8.9 2.9.9s2.2-.2 2.9-.9c.2-.2.5-.2.7 0 .2.2.2.5 0 .7zm-.1-1.8c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-primary hidden sm:block">
              senopost
            </span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search senopost"
              className="pl-10 bg-secondary border-none h-9 rounded-full focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {isLoggedIn ? (
            <>
              <Link href="/chat">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-secondary hidden sm:flex"
                >
                  <Bot className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex rounded-full hover:bg-secondary"
              >
                <Plus className="h-5 w-5" />
              </Button>
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
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-secondary hidden sm:flex"
              >
                <MessageSquare className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2 rounded-full hover:bg-secondary"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage src="/diverse-avatars.png" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        U
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/user/profile">View Profile</Link>
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
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="text-destructive">
                      Log Out
                    </Link>
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
