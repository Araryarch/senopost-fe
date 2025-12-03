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
  Send,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export interface CommentProps {
  id: string
  author: string
  content: string
  upvotes: number
  timeAgo: string
  replies?: CommentProps[]
  depth?: number

  /** Added props */
  activeReplyId?: string | null
  onReplyClick?: (id: string) => void
  onCloseReply?: () => void
}

export function Comment({
  id,
  author,
  content,
  upvotes,
  timeAgo,
  replies = [],
  depth = 0,

  /** Props from parent */
  activeReplyId,
  onReplyClick,
  onCloseReply,
}: CommentProps) {
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null)
  const [currentVotes, setCurrentVotes] = useState(upvotes)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const showReplyForm = activeReplyId === id
  const [replyContent, setReplyContent] = useState('')

  const [repliesList, setRepliesList] = useState(replies)
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)

  const handleVote = (type: 'up' | 'down') => {
    if (voteStatus === type) {
      setVoteStatus(null)
      setCurrentVotes(upvotes)
    } else {
      setVoteStatus(type)
      setCurrentVotes(type === 'up' ? upvotes + 1 : upvotes - 1)
    }
  }

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return

    setIsSubmittingReply(true)
    try {
      const newReply: CommentProps = {
        id: `c${Date.now()}`,
        author: 'current_user',
        content: replyContent,
        upvotes: 0,
        timeAgo: 'now',
        replies: [],
        depth: (depth || 0) + 1,
      }

      setRepliesList([...repliesList, newReply])
      setReplyContent('')

      // Close reply box via parent callback
      if (onCloseReply) onCloseReply()
    } finally {
      setIsSubmittingReply(false)
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
        {/* Header */}
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
            <AvatarImage src="/avatar-default.jpg" />
            <AvatarFallback className="text-xs">
              {author.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <span className="text-sm font-medium">{author}</span>
          <span className="text-xs text-muted-foreground">• {timeAgo}</span>
        </div>

        {/* Content */}
        {!isCollapsed && (
          <>
            <div className="ml-7 mb-2">
              <p className="text-sm leading-relaxed">{content}</p>
            </div>

            {/* Actions */}
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
                  <ArrowBigUp className="h-4 w-4" />
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
                  <ArrowBigDown className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={() => onReplyClick && onReplyClick(id)}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Reply
              </Button>

              <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                <Share2 className="h-3.5 w-3.5" />
                Share
              </Button>

              <Button variant="ghost" size="sm" className="h-7 px-1">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Nested Replies */}
            {shouldNest && repliesList.length > 0 && (
              <div className="mt-2">
                {repliesList.map((reply) => (
                  <Comment
                    key={reply.id}
                    {...reply}
                    depth={depth + 1}
                    activeReplyId={activeReplyId}
                    onReplyClick={onReplyClick}
                    onCloseReply={onCloseReply}
                  />
                ))}
              </div>
            )}

            {/* Reply Form */}
            {showReplyForm && (
              <div className="mt-3 ml-7 p-3 bg-secondary/50 rounded-lg border border-border">
                <Textarea
                  placeholder={`Reply to ${author}...`}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[80px] mb-2 text-sm"
                />

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCloseReply && onCloseReply()}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleSubmitReply}
                    disabled={!replyContent.trim() || isSubmittingReply}
                  >
                    <Send className="h-3.5 w-3.5 mr-1" />
                    {isSubmittingReply ? 'Posting...' : 'Reply'}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
