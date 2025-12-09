'use client'

import {
  Comment,
  CommentProps,
  buildCommentTree,
  FlatComment,
} from '@/components/comment'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { PostCard } from '@/components/post-card'
import { usePost } from '@/hooks/use-posts'
import { useComments, useCreateComment } from '@/hooks/use-comments'

export default function PostPage(props: { params: Promise<{ id: string }> }) {
  const [postId, setPostId] = useState<string | null>(null)
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    props.params.then((p) => setPostId(p.id))
  }, [props.params])

  const handleReplyClick = (commentId: string) => setActiveReplyId(commentId)
  const closeReplyForm = () => setActiveReplyId(null)

  const {
    post,
    isLoading: postLoading,
    error: postError,
  } = usePost(postId || '')
  // Cast comments to FlatComment[] because the hook returns any[] (or specific type if defined)
  // Ideally useComments should be generic or match type.
  // For now assuming API returns compatible structure.
  const { comments: flatComments, isLoading: commentsLoading } = useComments(
    postId || undefined,
  )
  const { createComment, isCreating } = useCreateComment(postId || '')

  const commentTree: CommentProps[] = buildCommentTree(
    flatComments as FlatComment[],
  )

  const handleCreateComment = async () => {
    if (!newComment.trim()) return
    try {
      await createComment({ content: newComment })
      setNewComment('')
    } catch {
      // toast handled in hook or silence? Hook doesn't have toast on error, manual logging here or add to hook?
      // The original code didn't have toast on error for comments.
    }
  }

  const authorUser = post?.author || ''

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
              username={post.author}
              subpost={post.community.name}
              cid={post.community.id}
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
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  className="rounded-full"
                  onClick={handleCreateComment}
                  disabled={isCreating || !newComment.trim()}
                >
                  {isCreating ? 'Posting...' : 'Comment'}
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
                    postId={postId}
                    activeReplyId={activeReplyId}
                    onReplyClick={handleReplyClick}
                    onCloseReply={closeReplyForm}
                    {...comment}
                  />
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
