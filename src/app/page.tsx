'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { RightSidebar } from '@/components/right-sidebar'
import { PostCard } from '@/components/post-card'
import { FeedTabs } from '@/components/feed-tabs'
import { BottomNav } from '@/components/bottom-nav'
import CreatePostWrapper from '@/components/create-post-wrapper'
import { useMemo, useState } from 'react'

const mockPosts = [
  {
    id: '1',
    title: 'Just released my first open source project after 6 months of work!',
    content:
      "I've been working on this project for the past 6 months and finally decided to open source it. It's a React component library that focuses on accessibility and performance. Would love to get some feedback from the community!",
    subreddit: 'programming',
    author: 'dev_enthusiast',
    upvotes: 15420,
    commentCount: 423,
    timeAgo: '5 hours ago',
  },
  {
    id: '2',
    title: 'The sunset view from my apartment was unreal today',
    content:
      'Living in the city has its perks. The way the light hit the buildings was absolutely breathtaking. Sometimes you just have to stop and appreciate the little things in life.',
    subreddit: 'CasualConversation',
    author: 'city_dweller',
    upvotes: 32150,
    commentCount: 891,
    timeAgo: '8 hours ago',
  },
  {
    id: '3',
    title:
      'TIL that honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still perfectly edible.',
    content:
      'The low moisture content and acidic pH create an environment where bacteria cannot survive. This is why honey has been used as a natural preservative throughout history.',
    subreddit: 'todayilearned',
    author: 'curious_mind',
    upvotes: 8720,
    commentCount: 234,
    timeAgo: '12 hours ago',
  },
  {
    id: '4',
    title: "My cat discovered the printer today and won't stop staring at it",
    content:
      "Every time the printer makes a sound, she jumps back and then slowly approaches it again. It's like watching a nature documentary about a curious predator investigating new territory.",
    subreddit: 'cats',
    author: 'cat_parent_2024',
    upvotes: 24680,
    commentCount: 567,
    timeAgo: '3 hours ago',
  },
  {
    id: '5',
    title:
      "What's a skill you learned during lockdown that you still use today?",
    content:
      'For me, it was cooking. I went from barely being able to make toast to now hosting dinner parties for friends. What about you all?',
    subreddit: 'AskReddit',
    author: 'question_asker',
    upvotes: 45230,
    commentCount: 12453,
    timeAgo: '1 day ago',
  },
  {
    id: '6',
    title: 'Finally beat my personal record on the hiking trail!',
    content:
      'After months of training, I managed to complete the 15km mountain trail in under 3 hours. The view at the top was worth every step. Next goal: tackle the advanced route!',
    subreddit: 'hiking',
    author: 'trail_runner',
    upvotes: 5670,
    commentCount: 189,
    timeAgo: '6 hours ago',
  },
]

export default function Page() {
  const [activeTab, setActiveTab] = useState<string>('best')

  const filteredPosts = useMemo(() => {
    const posts = [...mockPosts]

    switch (activeTab) {
      case 'hot':
        // sort by comment count (hot)
        return posts.sort((a, b) => b.commentCount - a.commentCount)
      case 'new':
        // sort by id descending as a proxy for newest
        return posts.sort((a, b) => Number(b.id) - Number(a.id))
      case 'top':
      case 'best':
      default:
        // sort by upvotes
        return posts.sort((a, b) => b.upvotes - a.upvotes)
    }
  }, [activeTab])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex ">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4 pb-20 lg:pb-4 overflow-y-auto scrollbar-hide">
          <CreatePostWrapper />
          <FeedTabs value={activeTab} onChange={(id) => setActiveTab(id)} />
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        </main>
        <RightSidebar />
      </div>
      <BottomNav />
    </div>
  )
}
