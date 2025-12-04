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
import api from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'

export interface CommentProps {
  replies: CommentProps[]
  id: string
  author: string
  content: string
  upvotes: number
  timeAgo: string
  parentId?: string | null
  depth?: number
  userVote?: 'up' | 'down' | null

  /** Props from parent */
  activeReplyId?: string | null
  onReplyClick?: (id: string) => void
  onCloseReply?: () => void
  postId?: string
}

interface FlatComment {
  id: string
  author: string
  content: string
  upvotes: number
  timeAgo: string
  parentId: string | null
}

// Helper function untuk convert flat comments ke nested tree
export function buildCommentTree(flatComments: FlatComment[]): CommentProps[] {
  const commentMap = new Map<string, CommentProps>()
  const roots: CommentProps[] = []

  // First pass: create map of all comments with empty replies array
  flatComments.forEach((comment) => {
    commentMap.set(comment.id, {
      id: comment.id,
      author: comment.author,
      content: comment.content,
      upvotes: comment.upvotes,
      timeAgo: comment.timeAgo,
      parentId: comment.parentId,
      replies: [],
    })
  })

  flatComments.forEach((comment) => {
    const commentNode = commentMap.get(comment.id)

    if (!commentNode) return

    if (comment.parentId === null || comment.parentId === undefined) {
      roots.push(commentNode)
    } else {
      const parent = commentMap.get(comment.parentId)
      if (parent) {
        parent.replies.push(commentNode)
      } else {
        roots.push(commentNode)
      }
    }
  })

  return roots
}

export function Comment({
  id,
  author,
  content,
  upvotes,
  timeAgo,
  replies,
  depth = 0,
  userVote,
  activeReplyId,
  onReplyClick,
  onCloseReply,
  postId,
}: CommentProps) {
  const queryClient = useQueryClient()
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(
    userVote || null,
  )
  const [currentVotes, setCurrentVotes] = useState(Number(upvotes) || 0)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const maxDepth = 4
  const shouldNest = depth < maxDepth
  const showReplyForm = activeReplyId === id

  const handleVote = async (type: 'up' | 'down') => {
    if (!id) return

    try {
      const value = type === 'up' ? 1 : -1

      if (voteStatus === type) {
        await api.post(`/comments/${id}/votes`, { value: 0 })
        setVoteStatus(null)
        setCurrentVotes(currentVotes + (type === 'up' ? -1 : 1))
      } else {
        await api.post(`/comments/${id}/votes`, { value })
        const prevStatus = voteStatus
        setVoteStatus(type)
        if (prevStatus === null) {
          setCurrentVotes(currentVotes + value)
        } else {
          setCurrentVotes(currentVotes + value * 2)
        }
      }

      // Invalidate comments query to refresh vote counts
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    } catch (err) {
      console.error('Vote error:', err)
    }
  }

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !postId) return

    setIsSubmittingReply(true)
    try {
      const payload = {
        content: replyContent,
        parentId: id,
      }

      await api.post(`/posts/${postId}/comments`, payload)

      setReplyContent('')
      if (onCloseReply) onCloseReply()

      // Invalidate comments query to refresh the comment tree with new reply
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    } catch (err) {
      console.error('Reply error:', err)
    } finally {
      setIsSubmittingReply(false)
    }
  }

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
            <AvatarImage src="" />
            <AvatarFallback className="text-xs">
              {(author?.charAt(0) || '?').toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <span className="text-sm font-medium">{author}</span>
          <span className="text-xs text-muted-foreground">• {timeAgo}</span>
        </div>

        {!isCollapsed && (
          <>
            <div className="ml-7 mb-2">
              <p className="text-sm leading-relaxed">{content}</p>
            </div>

            {/* Actions - Bottom nav style similar to post card */}
            <div className="flex items-center gap-2 ml-7 bg-secondary rounded-full px-2 py-1 mt-2">
              {/* Vote Buttons */}
              <div
                className={cn(
                  'flex items-center bg-secondary rounded-full transition-colors',
                  voteStatus === 'up'
                    ? 'bg-orange-500/10'
                    : voteStatus === 'down'
                      ? 'bg-blue-500/10'
                      : '',
                )}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-7 px-2 rounded-l-full hover:bg-orange-500/20',
                    voteStatus === 'up' && 'text-orange-500',
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
                    'text-xs font-semibold min-w-[2rem] text-center',
                    voteStatus === 'up' && 'text-orange-500',
                    voteStatus === 'down' && 'text-blue-500',
                  )}
                >
                  {currentVotes}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-7 px-2 rounded-r-full hover:bg-blue-500/20',
                    voteStatus === 'down' && 'text-blue-500',
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

              {/* Reply */}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 rounded-full hover:bg-secondary text-xs"
                onClick={() => onReplyClick && onReplyClick(id)}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Reply
              </Button>

              {/* Share */}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 rounded-full hover:bg-secondary text-xs"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </Button>

              {/* More */}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 rounded-full hover:bg-secondary ml-auto"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Nested Replies - recursively render child comments */}
            {shouldNest && replies.length > 0 && (
              <div className="mt-2">
                {replies.map((reply) => (
                  <Comment
                    key={reply.id}
                    {...reply}
                    depth={depth + 1}
                    activeReplyId={activeReplyId}
                    onReplyClick={onReplyClick}
                    onCloseReply={onCloseReply}
                    postId={postId}
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
