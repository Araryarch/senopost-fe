'use client'

import { Comment, CommentProps, buildCommentTree } from '@/components/comment'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { PostCard } from '@/components/post-card'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'

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

interface FlatComment {
  id: string
  author: string
  content: string
  upvotes: number
  timeAgo: string
  parentId: string | null
}

export default function PostPage(props: { params: Promise<{ id: string }> }) {
  const [postId, setPostId] = useState<string | null>(null)
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const queryClient = useQueryClient()

  const { user } = useAuth()

  const username = user?.name as string

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
      const res = await api.get<Post[]>('/posts', { params: { id: postId } })
      return res.data[0] || null
    },
    enabled: !!postId,
  })

  const { data: flatComments = [], isLoading: commentsLoading } = useQuery<
    FlatComment[]
  >({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const res = await api.get<FlatComment[]>(`/posts/${postId}/comments`)
      return res.data
    },
    enabled: !!postId,
  })

  const commentTree: CommentProps[] = buildCommentTree(flatComments)

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

  const author = post?.author || ''

  const mapCommentsToProps = (
    comments: CommentProps[],
    postId: string,
  ): CommentProps[] =>
    comments.map((c) => ({
      ...c,
      postId,
      replies: c.replies ? mapCommentsToProps(c.replies, postId) : [],
    }))

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
              username={username}
              subpost={post.community}
              id={post.id}
              title={post.title}
              author={post.author}
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
          ) : commentTree.length === 0 ? (
            <p className="text-center text-muted-foreground">No comments yet</p>
          ) : (
            <div className="space-y-2">
              {postId &&
                mapCommentsToProps(commentTree, postId).map((comment) => (
                  <Comment
                    key={comment.id}
                    {...comment}
                    postId={postId}
                    author={author}
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
