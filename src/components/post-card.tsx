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

interface PostCardProps {
  id: string
  title: string
  content?: string
  subreddit: string
  author: string
  upvotes: number
  commentCount: number
  timeAgo: string
  isCompact?: boolean
}

export function PostCard({
  id,
  title,
  content,
  subreddit,
  upvotes,
  commentCount,
  timeAgo,
}: PostCardProps) {
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null)
  const [currentVotes, setCurrentVotes] = useState(upvotes)

  const handleVote = (type: 'up' | 'down') => {
    if (voteStatus === type) {
      setVoteStatus(null)
      setCurrentVotes(upvotes)
    } else {
      setVoteStatus(type)
      let newVotes = type === 'up' ? upvotes + 1 : upvotes - 1
      if (newVotes < 0) newVotes = 0
      setCurrentVotes(newVotes)
    }
  }

  const formatVotes = (votes: number) => {
    if (votes >= 1000) return (votes / 1000).toFixed(1) + 'k'
    return votes.toString()
  }

  const voteColor =
    voteStatus === 'up'
      ? 'bg-red-900'
      : voteStatus === 'down'
        ? 'bg-blue-950'
        : ''

  return (
    <article className="bg-card rounded-xl border border-border hover:border-muted-foreground/30 transition-colors">
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Link
            href={`/r/${subreddit}`}
            className="flex items-center gap-2 hover:underline"
          >
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">
                {subreddit.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-xs font-semibold">r/{subreddit}</span>
          </Link>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>

        {/* Title & Content */}
        <Link href={`/r/${subreddit}/comments/${id}`}>
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
        <div className="flex items-center gap-2">
          {/* Vote Buttons */}
          <div
            className={cn(
              'flex items-center bg-secondary rounded-full',
              voteColor,
            )}
          >
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 px-2 rounded-l-full hover:bg-upvote/20',
                voteStatus === 'up' && 'text-upvote',
              )}
              onClick={() => handleVote('up')}
            >
              <ArrowBigUp className="h-5 w-5" />
            </Button>
            <span
              className={cn('text-xs font-semibold min-w-[2rem] text-center')}
            >
              {formatVotes(currentVotes)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 px-2 rounded-r-full hover:bg-downvote/20',
                voteStatus === 'down' && 'text-downvote',
              )}
              onClick={() => handleVote('down')}
            >
              <ArrowBigDown className="h-5 w-5" />
            </Button>
          </div>

          {/* Comments */}
          <Link href={`/r/${subreddit}/comments/${id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 rounded-full hover:bg-secondary"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs font-medium">{commentCount}</span>
            </Button>
          </Link>

          {/* Share */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 rounded-full hover:bg-secondary"
          >
            <Share2 className="h-4 w-4" />
            <span className="text-xs font-medium hidden sm:inline">Share</span>
          </Button>

          {/* Save */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-full hover:bg-secondary hidden sm:flex"
          >
            <Bookmark className="h-4 w-4" />
          </Button>

          {/* More */}
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
              <DropdownMenuItem>Hide</DropdownMenuItem>
              <DropdownMenuItem>Report</DropdownMenuItem>
              <DropdownMenuItem>Block Author</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  )
}
