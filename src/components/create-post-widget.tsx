'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link2 } from 'lucide-react'

export function CreatePostWidget() {
  return (
    <div className="bg-card rounded-xl border border-border p-3 mb-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary text-primary-foreground">
            U
          </AvatarFallback>
        </Avatar>
        <Link href="/submit" className="flex-1">
          <Input
            placeholder="Create Post"
            className="bg-secondary border-none h-10 rounded-full cursor-pointer hover:bg-muted transition-colors"
            readOnly
          />
        </Link>
        <Link href="/submit?type=link">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-secondary"
          >
            <Link2 className="h-5 w-5 text-muted-foreground" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
