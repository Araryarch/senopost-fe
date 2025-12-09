import Link from 'next/link'
import { Bell, Bot, ChevronDown, Moon, Plus, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogoutButton } from '@/components/logout-button'
import { useTheme } from 'next-themes'

interface UserNavProps {
  user: { image?: string; name?: string; email?: string } | undefined
}

export function UserNav({ user }: UserNavProps) {
  const { theme, setTheme } = useTheme()
  const sessionUser = user

  return (
    <div className="flex items-center gap-1">
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
                {sessionUser?.name?.[0] ?? sessionUser?.email?.[0] ?? 'U'}
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
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
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
    </div>
  )
}
