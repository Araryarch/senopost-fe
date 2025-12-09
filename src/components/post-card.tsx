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
  onDelete?: (postId: string) => void
}

import { useVote } from '@/hooks/use-vote'

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
  onDelete,
}: PostCardProps) {
  const { voteStatus, handleVote, currentVotes } = useVote({
    id,
    initialUpvotes: upvotes,
    type: 'post',
  })

  const formatVotes = (votes: number) => {
    if (votes >= 1000) return (votes / 1000).toFixed(1) + 'k'
    if (votes <= -1000) return (votes / 1000).toFixed(1) + 'k'
    return votes.toString()
  }

  return (
    <article className="bg-card hover:bg-neutral-50 dark:hover:bg-neutral-900 border border-border rounded-md cursor-pointer transition-colors mb-3 flex overflow-hidden">
      {/* Vote Side - Desktop */}
      <div className="hidden sm:flex flex-col items-center p-2 bg-neutral-50/50 dark:bg-neutral-900/10 w-12 shrink-0 border-r border-border/50">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 rounded-sm hover:bg-transparent hover:text-orange-500"
          onClick={(e) => {
            e.stopPropagation()
            handleVote('up')
          }}
        >
          <ArrowBigUp
            className={cn(
              'h-6 w-6',
              voteStatus === 'up' && 'fill-orange-500 text-orange-500',
            )}
          />
        </Button>
        <span
          className={cn(
            'text-xs font-bold my-1',
            voteStatus === 'up' && 'text-orange-500',
            voteStatus === 'down' && 'text-blue-500',
          )}
        >
          {formatVotes(currentVotes)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 rounded-sm hover:bg-transparent hover:text-blue-500"
          onClick={(e) => {
            e.stopPropagation()
            handleVote('down')
          }}
        >
          <ArrowBigDown
            className={cn(
              'h-6 w-6',
              voteStatus === 'down' && 'fill-blue-500 text-blue-500',
            )}
          />
        </Button>
      </div>

      <div className="flex-1 p-2 sm:p-3 pb-1">
        {/* Mobile Header (Subreddit + User + Time) */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          {subpost && (
            <Link
              href={`/r/${cid}`}
              onClick={(e) => e.stopPropagation()}
              className="font-bold text-foreground hover:underline flex items-center gap-1"
            >
              {subpost.startsWith('r/') ? subpost : `mid/${subpost}`}
            </Link>
          )}
          <span>•</span>
          <span className="flex items-center gap-1">
            Posted by{' '}
            <span className="hover:underline cursor-pointer">u/{author}</span>
          </span>
          <span>•</span>
          <span>{timeAgo}</span>
        </div>

        <Link href={`/r/${subpost}/comments/${id}`}>
          <h3 className="text-lg font-medium leading-6 -mt-1 mb-2 text-foreground group-hover:text-foreground">
            {title}
          </h3>
        </Link>

        {content && (
          <div className="text-sm text-foreground/90 mb-3 line-clamp-3">
            {content}
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex items-center gap-1 -ml-2">
          {/* Mobile Vote (Horizontal) */}
          <div className="flex sm:hidden items-center border border-border rounded-full p-1 bg-secondary/50 mr-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation()
                handleVote('up')
              }}
            >
              <ArrowBigUp
                className={cn(
                  'h-5 w-5',
                  voteStatus === 'up' && 'fill-orange-500 text-orange-500',
                )}
              />
            </Button>
            <span className="text-xs font-bold px-1">
              {formatVotes(currentVotes)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation()
                handleVote('down')
              }}
            >
              <ArrowBigDown
                className={cn(
                  'h-5 w-5',
                  voteStatus === 'down' && 'fill-blue-500 text-blue-500',
                )}
              />
            </Button>
          </div>

          <Link href={`/r/${subpost}/comments/${id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 text-muted-foreground hover:bg-secondary/80 rounded-sm px-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs font-bold">{commentCount} Comments</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 text-muted-foreground hover:bg-secondary/80 rounded-sm px-2"
          >
            <Share2 className="h-4 w-4" />
            <span className="text-xs font-bold">Share</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 text-muted-foreground hover:bg-secondary/80 rounded-sm px-2 hidden sm:flex"
          >
            <Bookmark className="h-4 w-4" />
            <span className="text-xs font-bold">Save</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-secondary/80 rounded-sm ml-auto sm:ml-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {username === author && (
                <DropdownMenuItem
                  onClick={async (e) => {
                    e.stopPropagation()
                    try {
                      await api.delete(`/posts/${id}`)
                      toast.success('Post deleted successfully')
                      onDelete?.(id)
                    } catch {
                      toast.error('Failed to delete post')
                    }
                  }}
                >
                  Delete
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  )
}
