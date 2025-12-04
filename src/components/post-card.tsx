'use client'

import Link from 'next/link'
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface PostCardProps {
  id: string
  title: string
  cid?: string
  content?: string
  subpost: string
  author: string
  username: string
  upvotes: number
  commentCount: number
  timeAgo: string
  isCompact?: boolean
}

export function PostCard({
  id,
  title,
  cid,
  content,
  subpost,
  author,
  username,
  upvotes,
  commentCount,
  timeAgo,
}: PostCardProps) {
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null)
  const [voteCount, setVoteCount] = useState(0)

  const handleVote = async (type: 'up' | 'down') => {
    const previousVoteStatus = voteStatus
    const previousVoteCount = voteCount

    try {
      let newVoteStatus: 'up' | 'down' | null = type
      let voteDelta = 0

      if (voteStatus === null) {
        voteDelta = type === 'up' ? 1 : -1
        newVoteStatus = type
      } else if (voteStatus === type) {
        voteDelta = type === 'up' ? -1 : 1
        newVoteStatus = null
      } else {
        voteDelta = type === 'up' ? 2 : -2
        newVoteStatus = type
      }

      setVoteStatus(newVoteStatus)
      setVoteCount(previousVoteCount + voteDelta)

      let value = 0
      if (newVoteStatus === 'up') value = 1
      else if (newVoteStatus === 'down') value = -1
      else value = 0

      await api.post(`/posts/${id}/votes`, { value })
      toast.success('add 1 votes success')
    } catch (err) {
      console.error('Failed to vote:', err)
      setVoteStatus(previousVoteStatus)
      setVoteCount(previousVoteCount)
    }
  }

  const formatVotes = (votes: number) => {
    if (votes >= 1000) return (votes / 1000).toFixed(1) + 'k'
    if (votes <= -1000) return (votes / 1000).toFixed(1) + 'k'
    return votes.toString()
  }

  const displayVotes = upvotes + voteCount

  const voteColor =
    voteStatus === 'up'
      ? 'bg-orange-500/10'
      : voteStatus === 'down'
        ? 'bg-blue-500/10'
        : ''

  return (
    <article className="bg-card rounded-xl border border-border hover:border-muted-foreground/30 transition-colors mb-3">
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href={`/r/${cid}`}
            className="flex items-center gap-2 hover:underline"
          >
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">
                {subpost.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-xs font-semibold">r/{subpost}</span>
          </Link>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>

        <Link href={`/r/${subpost}/comments/${id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        {content && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
            {content}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 bg-secondary">
          {/* Vote Buttons */}
          <div
            className={cn(
              'flex items-center bg-secondary rounded-full transition-colors',
              voteColor,
            )}
          >
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 px-2 rounded-l-full hover:bg-orange-500/20',
                voteStatus === 'up' && 'text-orange-500',
              )}
              onClick={() => handleVote('up')}
            >
              <ArrowBigUp
                className={cn('h-5 w-5', voteStatus === 'up' && 'fill-current')}
              />
            </Button>
            <span
              className={cn(
                'text-xs font-semibold min-w-[2rem] text-center',
                voteStatus === 'up' && 'text-orange-500',
                voteStatus === 'down' && 'text-blue-500',
              )}
            >
              {formatVotes(displayVotes)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 px-2 rounded-r-full hover:bg-blue-500/20',
                voteStatus === 'down' && 'text-blue-500',
              )}
              onClick={() => handleVote('down')}
            >
              <ArrowBigDown
                className={cn(
                  'h-5 w-5',
                  voteStatus === 'down' && 'fill-current',
                )}
              />
            </Button>
          </div>

          {/* Comments */}
          <Link href={`/r/${subpost}/comments/${id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 rounded-full hover:bg-secondary"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs font-medium">{commentCount}</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 rounded-full hover:bg-secondary"
          >
            <Share2 className="h-4 w-4" />
            <span className="text-xs font-medium hidden sm:inline">Share</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-full hover:bg-secondary hidden sm:flex"
          >
            <Bookmark className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-full hover:bg-secondary ml-auto"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {username === author && (
                <DropdownMenuItem
                  onClick={async () => {
                    try {
                      await api.delete(`/posts/${id}`)
                      toast.success('Post deleted successfully')
                    } catch (err) {
                      toast.error('Failed to delete post')
                      console.error(err)
                    }
                  }}
                >
                  Delete
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>Comming Soon</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  )
}
