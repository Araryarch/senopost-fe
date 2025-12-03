'use client'

import { useAuth } from '@/hooks/use-auth'
import { CreatePostWidget } from '@/components/create-post-widget'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CreatePostWrapper() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <CreatePostWidget />
  }

  return (
    <div className="mb-4">
      <div className="p-4 rounded-md bg-muted text-muted-foreground flex items-center justify-between">
        <div>
          <strong>Please log in</strong>
          <div className="text-sm">Log in to create posts and interact.</div>
        </div>
        <div className="flex gap-2">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Log In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
