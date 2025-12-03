'use client'

import { useState } from 'react'
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Share2,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface CommentProps {
  id: string
  author: string
  content: string
  upvotes: number
  timeAgo: string
  replies?: CommentProps[]
  depth?: number
}

export function Comment({
  id,
  author,
  content,
  upvotes,
  timeAgo,
  replies = [],
  depth = 0,
}: CommentProps) {
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null)
  const [currentVotes, setCurrentVotes] = useState(upvotes)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)

  console.log(id)

  const handleVote = (type: 'up' | 'down') => {
    if (voteStatus === type) {
      setVoteStatus(null)
      setCurrentVotes(upvotes)
    } else {
      setVoteStatus(type)
      setCurrentVotes(type === 'up' ? upvotes + 1 : upvotes - 1)
    }
  }

  const maxDepth = 4
  const shouldNest = depth < maxDepth

  return (
    <div
      className={cn(
        'relative',
        depth > 0 &&
          'ml-4 pl-4 border-l-2 border-border hover:border-muted-foreground/50',
      )}
    >
      <div className="py-2">
        {/* Comment Header */}
        <div className="flex items-center gap-2 mb-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronUp className="h-3 w-3" />
            )}
          </Button>
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={`/.jpg?height=24&width=24&query=${author} avatar`}
            />
            <AvatarFallback className="text-xs">
              {author.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hover:underline cursor-pointer">
            {author}
          </span>
          <span className="text-xs text-muted-foreground">• {timeAgo}</span>
        </div>

        {/* Comment Content */}
        {!isCollapsed && (
          <>
            <div className="ml-7 mb-2">
              <p className="text-sm leading-relaxed">{content}</p>
            </div>

            {/* Comment Actions */}
            <div className="flex items-center gap-1 ml-7">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-7 px-1 hover:bg-upvote/20',
                    voteStatus === 'up' && 'text-upvote',
                  )}
                  onClick={() => handleVote('up')}
                >
                  <ArrowBigUp
                    className={cn(
                      'h-4 w-4',
                      voteStatus === 'up' && 'fill-current',
                    )}
                  />
                </Button>
                <span
                  className={cn(
                    'text-xs font-medium min-w-[1.5rem] text-center',
                    voteStatus === 'up' && 'text-upvote',
                    voteStatus === 'down' && 'text-downvote',
                  )}
                >
                  {currentVotes}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-7 px-1 hover:bg-downvote/20',
                    voteStatus === 'down' && 'text-downvote',
                  )}
                  onClick={() => handleVote('down')}
                >
                  <ArrowBigDown
                    className={cn(
                      'h-4 w-4',
                      voteStatus === 'down' && 'fill-current',
                    )}
                  />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Reply
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-1 text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Replies */}
            {shouldNest && replies.length > 0 && (
              <div className="mt-2">
                {replies.map((reply) => (
                  <Comment key={reply.id} {...reply} depth={depth + 1} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
