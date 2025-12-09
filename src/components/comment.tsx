'use client'

import { useState } from 'react'
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Send,
  X,
  Pencil,
  Trash,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

import { useVote } from '@/hooks/use-vote'
import {
  useCreateComment,
  useDeleteComment,
  useEditComment,
} from '@/hooks/use-comments'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'react-hot-toast'

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

export interface FlatComment {
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
  const { voteStatus, handleVote, currentVotes } = useVote({
    id,
    initialUpvotes: Number(upvotes) || 0,
    initialVoteStatus: userVote,
    type: 'comment',
    postId,
  })

  // Auth & Permissions
  const { user } = useAuth()
  const isAuthor = user?.username === author || user?.name === author

  // Mutations
  const { createComment, isCreating } = useCreateComment(postId || '')
  const { deleteComment } = useDeleteComment(postId || '')
  const { editComment, isEditing: isSubmittingEdit } = useEditComment(
    postId || '',
  )

  // Local State
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)

  const maxDepth = 4
  const shouldNest = depth < maxDepth
  const showReplyForm = activeReplyId === id

  const handleEdit = async () => {
    if (!editContent.trim()) return
    try {
      await editComment({ commentId: id, content: editContent })
      setIsEditing(false)
      toast.success('Comment updated')
    } catch {
      toast.error('Failed to update comment')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteComment(id)
      toast.success('Comment deleted')
    } catch {
      toast.error('Failed to delete comment')
    }
  }

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !postId) return

    try {
      await createComment({ content: replyContent, parentId: id })
      setReplyContent('')
      if (onCloseReply) onCloseReply()
    } catch (err) {
      console.error('Reply error:', err)
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
              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleEdit}
                      disabled={isSubmittingEdit || !editContent.trim()}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setIsEditing(false)
                        setEditContent(content)
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed">{content}</p>
              )}
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

              {/* More - Only for author */}
              {isAuthor && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 rounded-full hover:bg-secondary ml-auto"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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
                    disabled={!replyContent.trim() || isCreating}
                  >
                    <Send className="h-3.5 w-3.5 mr-1" />
                    {isCreating ? 'Posting...' : 'Reply'}
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
