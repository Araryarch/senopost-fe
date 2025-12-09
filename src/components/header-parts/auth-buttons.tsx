import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

export function AuthButtons() {
  return (
    <div className="flex items-center gap-1">
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
    </div>
  )
}
