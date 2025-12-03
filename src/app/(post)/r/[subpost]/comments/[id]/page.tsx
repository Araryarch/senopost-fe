'use client'

import { Comment } from '@/components/comment'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const mockPost = {
  id: '1',
  title: 'Just released my first open source project after 6 months of work!',
  content: `I've been working on this project for the past 6 months and finally decided to open source it. It's a React component library that focuses on accessibility and performance.

The library includes over 50 components, all fully accessible and tested with screen readers. I've also included comprehensive documentation and examples.

Key features:
- Full TypeScript support
- Tree-shakeable exports
- CSS-in-JS with zero runtime
- Extensive theming capabilities
- Built-in dark mode support

Would love to get some feedback from the community! Feel free to check out the GitHub repo and let me know what you think.`,
  imageUrl: '/react-code-editor.png',
  subreddit: 'programming',
  subredditIcon: '/programming-icon.jpg',
  author: 'dev_enthusiast',
  upvotes: 15420,
  commentCount: 423,
  timeAgo: '5 hours ago',
}

const mockComments = [
  {
    id: 'c1',
    author: 'react_dev_pro',
    content:
      "This is amazing work! I've been looking for a library like this. The accessibility focus is exactly what we need more of in the React ecosystem.",
    upvotes: 234,
    timeAgo: '4 hours ago',
    replies: [
      {
        id: 'c1r1',
        author: 'dev_enthusiast',
        content:
          "Thank you so much! Accessibility was my main priority from day one. I'm glad it resonates with the community.",
        upvotes: 89,
        timeAgo: '3 hours ago',
        replies: [
          {
            id: 'c1r1r1',
            author: 'a11y_advocate',
            content:
              'Have you considered adding ARIA live regions for dynamic content? That would be a great addition!',
            upvotes: 45,
            timeAgo: '2 hours ago',
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: 'c2',
    author: 'senior_engineer',
    content:
      'The documentation looks really thorough. One suggestion: maybe add some real-world examples showing how to integrate with popular state management libraries?',
    upvotes: 156,
    timeAgo: '3 hours ago',
    replies: [],
  },
  {
    id: 'c3',
    author: 'ui_designer',
    content:
      'The default styling is beautiful! Love the attention to detail in the animations. How customizable is the theming system?',
    upvotes: 98,
    timeAgo: '2 hours ago',
    replies: [
      {
        id: 'c3r1',
        author: 'dev_enthusiast',
        content:
          'The theming is fully customizable! You can override any CSS variable or use the theme provider to create completely custom themes. Check out the theming docs for examples.',
        upvotes: 67,
        timeAgo: '1 hour ago',
        replies: [],
      },
    ],
  },
]

import React from 'react'

export default function PostPage(props: {
  params: Promise<{ subreddit: string; id: string }>
}) {
  const { subreddit } = React.use(props.params)

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null)

  const handleReplyClick = (id: string) => {
    if (!activeReplyId) {
      setActiveReplyId(id)
    }
  }

  const closeReplyForm = () => setActiveReplyId(null)

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 min-w-0 p-4 pb-20 lg:pb-4">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Feed
          </Button>
        </Link>

        {/* Post */}
        <article className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4">
            {/* Post Header */}
            <div className="flex items-center gap-2 mb-3">
              <Link
                href={`/r/${subreddit}`}
                className="flex items-center gap-2 hover:underline"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">
                    {subreddit.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-semibold">r/{subreddit}</span>
              </Link>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                Posted by u/{mockPost.author}
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                {mockPost.timeAgo}
              </span>
            </div>

            {/* Post Title */}
            <h1 className="text-xl font-bold mb-3">{mockPost.title}</h1>

            {/* Post Content */}
            <div className="prose prose-sm max-w-none mb-4">
              {mockPost.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-3 text-foreground">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Post Image */}
            {mockPost.imageUrl && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
                <Image
                  src={mockPost.imageUrl || '/placeholder.svg'}
                  alt={mockPost.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <div className="flex items-center bg-secondary rounded-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 rounded-l-full hover:bg-upvote/20"
                >
                  <ArrowBigUp className="h-5 w-5" />
                </Button>
                <span className="text-sm font-semibold min-w-[3rem] text-center">
                  {(mockPost.upvotes / 1000).toFixed(1)}k
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 rounded-r-full hover:bg-downvote/20"
                >
                  <ArrowBigDown className="h-5 w-5" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-2 rounded-full hover:bg-secondary"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {mockPost.commentCount} Comments
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-2 rounded-full hover:bg-secondary"
              >
                <Share2 className="h-4 w-4" />
                <span className="text-sm font-medium">Share</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-2 rounded-full hover:bg-secondary"
              >
                <Bookmark className="h-4 w-4" />
                <span className="text-sm font-medium">Save</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-full hover:bg-secondary ml-auto"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </article>

        {/* Comment Form */}
        <div className="bg-card rounded-xl border border-border p-4 mt-4">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/diverse-user-avatars.png" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                U
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="What are your thoughts?"
                className="min-h-[100px] resize-none border-border focus-visible:ring-primary"
              />
              <div className="flex justify-end mt-2">
                <Button size="sm" className="rounded-full">
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border mt-4 p-4">
          <div className="space-y-2">
            {mockComments.map((comment) => (
              <Comment
                key={comment.id}
                {...comment}
                activeReplyId={activeReplyId}
                onReplyClick={handleReplyClick}
                onCloseReply={closeReplyForm}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
