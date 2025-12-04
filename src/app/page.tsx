'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { RightSidebar } from '@/components/right-sidebar'
import { PostCard } from '@/components/post-card'
import { FeedTabs } from '@/components/feed-tabs'
import { BottomNav } from '@/components/bottom-nav'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import Layouts from './Layouts/layouts'

export default function Page() {
  const [activeTab, setActiveTab] = useState<string>('best')

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await api.get('/posts')
      console.log(res.data)
      return res.data
    },
  })

  const filteredPosts = useMemo(() => {
    if (!posts || posts.length === 0) return []

    const postsCopy = [...posts]

    switch (activeTab) {
      case 'hot':
        return postsCopy.sort(
          (a, b) => (b.commentCount || 0) - (a.commentCount || 0),
        )
      case 'new':
        return postsCopy.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        )
      case 'top':
      case 'best':
      default:
        return postsCopy.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
    }
  }, [activeTab, posts])

  const safeActiveTab =
    typeof activeTab === 'string' && activeTab ? activeTab : 'best'

  if (isLoading) {
    return (
      <Layouts>
        <div className="min-h-screen flex items-center justify-center">
          Loading posts...
        </div>
      </Layouts>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4 pb-20 lg:pb-4 overflow-y-auto scrollbar-hide">
          <FeedTabs
            value={safeActiveTab}
            onChange={(id) =>
              setActiveTab(typeof id === 'string' && id ? id : 'best')
            }
          />
          <div className="space-y-3">
            {filteredPosts.map((post) =>
              post && post.id ? (
                <PostCard
                  key={post.id}
                  id={post.id}
                  cid={post.community.id}
                  title={post.title}
                  content={post.content}
                  subpost={post.community}
                  author={post.author}
                  upvotes={post.upvotes || 0}
                  commentCount={post.commentCount || 0}
                  timeAgo={post.timeAgo}
                />
              ) : null,
            )}
          </div>
        </main>
        <RightSidebar />
      </div>
      <BottomNav />
    </div>
  )
}
