'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { RightSidebar } from '@/components/right-sidebar'
import { PostCard } from '@/components/post-card'
import { BottomNav } from '@/components/bottom-nav'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import Layouts from '@/app/Layouts/layouts'

export default function Page() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await api.get('/posts')
      console.log(res.data)
      return res.data
    },
  })

  // Sort posts from best (highest upvotes) to low
  const filteredPosts = useMemo(() => {
    if (!posts || posts.length === 0) return []
    const postsCopy = [...posts]
    return postsCopy.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
  }, [posts])

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
          <div className="space-y-3">
            {filteredPosts.map((post) =>
              post && post.id ? (
                <PostCard
                  key={post.id}
                  id={post.id}
                  cid={post.community}
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
