/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useState, useEffect } from 'react'
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

export interface CommentProps {
  id: string
  parentId?: string | null
  depth?: number

  /** Props from parent */
  activeReplyId?: string | null
  onReplyClick?: (id: string) => void
  onCloseReply?: () => void
  postId?: string
}

export function Comment({
  id,
  depth = 0,
  activeReplyId,
  onReplyClick,
  onCloseReply,
  postId,
}: CommentProps) {
  const [author, setAuthor] = useState('Anonymous')
  const [content, setContent] = useState('')
  const [, setUpvotes] = useState(0)
  const [timeAgo, setTimeAgo] = useState('')
  const [replies, setReplies] = useState<string[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null)
  const [currentVotes, setCurrentVotes] = useState(0)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)

  const maxDepth = 4
  const shouldNest = depth < maxDepth
  const showReplyForm = activeReplyId === id

  useEffect(() => {
    fetchCommentData()
  }, [id])

  const fetchCommentData = async () => {
    try {
      setIsLoading(true)
      const response = await api.get(`/comments/${id}`)
      const data = response.data

      setAuthor(data.author || 'Anonymous')
      setContent(data.content || '')
      setUpvotes(data.upvotes || 0)
      setCurrentVotes(data.upvotes || 0)
      setTimeAgo(data.timeAgo || '')

      // Expecting replies as array of comment IDs
      setReplies(data.replies || [])
    } catch (err) {
      console.error('Failed to fetch comment:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVote = async (type: 'up' | 'down') => {
    if (!postId || !id) return

    try {
      const value = type === 'up' ? 1 : -1

      if (voteStatus === type) {
        await api.post(`/posts/${postId}/comments/${id}/votes`, { value: 0 })
        setVoteStatus(null)
        setCurrentVotes(currentVotes + (type === 'up' ? -1 : 1))
      } else {
        await api.post(`/posts/${postId}/comments/${id}/votes`, { value })
        const prevStatus = voteStatus
        setVoteStatus(type)
        if (prevStatus === null) {
          setCurrentVotes(currentVotes + value)
        } else {
          setCurrentVotes(currentVotes + value * 2)
        }
      }
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

      const res = await api.post(`/posts/${postId}/comments`, payload)

      // Tambah reply ID ke list
      setReplies([...replies, res.data.id])
      setReplyContent('')
      if (onCloseReply) onCloseReply()
    } catch (err) {
      console.error('Reply error:', err)
    } finally {
      setIsSubmittingReply(false)
    }
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          'relative py-2',
          depth > 0 &&
            'ml-4 pl-4 border-l-2 border-border hover:border-muted-foreground/50',
        )}
      >
        <div className="ml-7 py-2 text-sm text-muted-foreground animate-pulse">
          Loading comment...
        </div>
      </div>
    )
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

            {/* Nested Replies - recursively render child comments by ID */}
            {shouldNest && replies.length > 0 && (
              <div className="mt-2">
                {replies.map((replyId) => (
                  <Comment
                    key={replyId}
                    id={replyId}
                    parentId={id}
                    depth={depth + 1}
                    postId={postId}
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
