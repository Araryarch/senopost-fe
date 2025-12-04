'use client'

import { Comment } from '@/components/comment'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { PostCard } from '@/components/post-card'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

interface Post {
  id: string
  title: string
  community: string
  subpost: string
  author: string
  upvotes: number
  commentCount: number
  timeAgo: string
}

interface CommentItem {
  id: string
  parentId: string | null
}

export default function PostPage(props: { params: Promise<{ id: string }> }) {
  const [postId, setPostId] = useState<string | null>(null)
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const queryClient = useQueryClient()

  useEffect(() => {
    props.params.then((p) => setPostId(p.id))
  }, [props.params])

  const handleReplyClick = (commentId: string) => setActiveReplyId(commentId)
  const closeReplyForm = () => setActiveReplyId(null)

  const {
    data: post,
    isLoading: postLoading,
    error: postError,
  } = useQuery<Post | null>({
    queryKey: ['post', postId],
    queryFn: async () => {
      const res = await api.get<Post>(`/posts/${postId}`)
      return res.data
    },
    enabled: !!postId,
  })

  // Fetch hanya top-level comments (parentId === null)
  const { data: topLevelComments = [], isLoading: commentsLoading } = useQuery<
    CommentItem[]
  >({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const res = await api.get<CommentItem[]>(`/posts/${postId}/comments`)
      // Filter hanya top-level comments
      return res.data.filter((c) => c.parentId === null)
    },
    enabled: !!postId,
  })

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await api.post(`/posts/${postId}/comments`, {
        content,
        parentId: null,
      })
      return res.data
    },
    onSuccess: () => {
      setNewComment('')
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })

  const authorUser = post?.author || ''

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 min-w-0 p-4 pb-20 lg:pb-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Feed
          </Button>
        </Link>

        {postLoading ? (
          <div className="text-center p-4 text-muted-foreground">
            Loading post...
          </div>
        ) : postError ? (
          <div className="text-center p-4 text-red-500">
            Failed to load post
          </div>
        ) : post ? (
          <article className="rounded-xl overflow-hidden">
            <PostCard
              username={post.author}
              subpost={post.community}
              id={post.id}
              title={post.title}
              author={authorUser}
              upvotes={post.upvotes}
              commentCount={post.commentCount}
              timeAgo={post.timeAgo}
            />
          </article>
        ) : (
          <div className="text-center p-4 text-red-500">Post not found</div>
        )}

        {/* Top-level Comment Form */}
        <div className="bg-card rounded-xl border border-border p-4 mt-4">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                A
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="What are your thoughts?"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px] resize-none border-border focus-visible:ring-primary"
              />
              {commentMutation.isError && (
                <p className="text-red-500 text-sm mt-1">
                  Failed to post comment. Try again.
                </p>
              )}
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  className="rounded-full"
                  onClick={() => commentMutation.mutate(newComment)}
                  disabled={commentMutation.isPending || !newComment.trim()}
                >
                  {commentMutation.isPending ? 'Posting...' : 'Comment'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="bg-card rounded-xl border border-border mt-4 p-4">
          {commentsLoading ? (
            <p className="text-center text-muted-foreground">
              Loading comments...
            </p>
          ) : topLevelComments.length === 0 ? (
            <p className="text-center text-muted-foreground">No comments yet</p>
          ) : (
            <div className="space-y-2">
              {topLevelComments.map((comment) => (
                <Comment
                  key={comment.id}
                  id={comment.id}
                  parentId={comment.parentId}
                  postId={postId || undefined}
                  activeReplyId={activeReplyId}
                  onReplyClick={handleReplyClick}
                  onCloseReply={closeReplyForm}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
