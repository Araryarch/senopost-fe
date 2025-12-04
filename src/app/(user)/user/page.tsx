'use client'

import { Header } from '@/components/header'
import { PostCard } from '@/components/post-card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Cake, Settings } from 'lucide-react'
import Link from 'next/link'
import { BottomNav } from '@/components/bottom-nav'
import { useAuth } from '@/hooks/use-auth'
import api from '@/lib/api'
import React, { useEffect, useState } from 'react'
import Layouts from '@/app/Layouts/layouts'

type Post = {
  id: string
  title: string
  content: string
  img?: string | null
  isNsfw: boolean
  isSpoiler: boolean
  score: number
  createdAt: string
  communityId: string
}

type Community = {
  id: string
  name: string
  description?: string
}

type User = {
  id: string
  email: string
  username: string
  bio?: string | null
  posts: Post[]
}

export default function UserProfilePage() {
  const { user: rawUser, loading } = useAuth()
  const user = rawUser as User | null

  const [communities, setCommunities] = useState<Community[]>([])

  useEffect(() => {
    if (!user) return

    const uniqueIds = Array.from(
      new Set(user.posts.map((post) => post.communityId)),
    )

    const fetchCommunities = async () => {
      try {
        const res = await Promise.all(
          uniqueIds.map((id) =>
            api.get(`/communities/${id}`).then((r) => r.data),
          ),
        )
        setCommunities(res)
      } catch (err) {
        console.error('Failed to fetch communities', err)
      }
    }

    fetchCommunities()
  }, [user])

  if (loading || !user) {
    return (
      <Layouts withRightSidebar={false} withSidebar={false}>
        <div className="min-h-screen flex items-center justify-center">
          Loading user data...
        </div>
      </Layouts>
    )
  }

  const username = user.username || user.email.split('@')[0]
  const posts = user.posts || []

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="h-32 bg-gradient-to-r from-primary/30 to-primary/60" />

      <div className="max-w-4xl mx-auto px-4 pb-20 lg:pb-4">
        <div className="relative -mt-16 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="h-32 w-32 rounded-full border-4 border-background bg-primary flex items-center justify-center">
              <span className="text-4xl font-bold text-primary-foreground">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold">{username}</h1>
              <p className="text-muted-foreground">u/{username}</p>
            </div>
            <div className="flex gap-2 pb-2">
              <Link href="/settings/profile">
                <Button
                  variant="outline"
                  className="rounded-full bg-transparent"
                  size="icon"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="posts">
              <TabsList className="bg-card border rounded-full p-1 mb-4">
                <TabsTrigger value="posts" className="rounded-full">
                  Posts
                </TabsTrigger>
                <TabsTrigger value="comments" className="rounded-full">
                  Comments
                </TabsTrigger>
                <TabsTrigger value="community" className="rounded-full">
                  Community
                </TabsTrigger>
                <TabsTrigger value="upvoted" className="rounded-full">
                  Upvoted
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-3">
                {posts.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      No posts yet
                    </CardContent>
                  </Card>
                ) : (
                  posts.map((post) => (
                    <PostCard
                      subpost={''}
                      author={''}
                      upvotes={0}
                      commentCount={0}
                      timeAgo={''}
                      key={post.id}
                      {...post}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="comments">
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No comments yet
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="community" className="space-y-3">
                {communities.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      No communities yet
                    </CardContent>
                  </Card>
                ) : (
                  communities.map((community) => (
                    <Card key={community.id}>
                      <CardContent className="px-4">
                        <h3 className="font-semibold">{community.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {community.description || 'No description'}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="upvoted">
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No upvoted posts
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold">About</h3>
                <p className="text-sm text-muted-foreground">
                  {user.bio ||
                    'Just a friendly redditor who loves programming and cats. Always learning something new!'}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Cake className="h-4 w-4" />
                    <span>Date Start: March 15, 2021</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>3 years on Senopost</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
