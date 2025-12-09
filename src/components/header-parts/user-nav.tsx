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
import { useNotifications } from '@/hooks/use-notifications'

interface UserNavProps {
  user: { image?: string; name?: string; email?: string } | undefined
}

export function UserNav({ user }: UserNavProps) {
  const { theme, setTheme } = useTheme()
  const sessionUser = user
  const { notifications, unreadCount } = useNotifications()

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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-secondary hidden sm:flex relative"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <span className="font-semibold text-sm">Notifications</span>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="cursor-pointer p-3"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm">{notification.message}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

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
