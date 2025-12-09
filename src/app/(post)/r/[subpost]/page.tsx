'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, PersonStandingIcon, Settings } from 'lucide-react'
import Link from 'next/link'
import { BottomNav } from '@/components/bottom-nav'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { PostCard } from '@/components/post-card'

function CommunitySkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-32 bg-secondary rounded-b-2xl mb-6" />
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
        <div className="h-32 w-32 rounded-full bg-secondary" />
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-secondary w-1/3 rounded" />
          <div className="h-4 bg-secondary w-1/2 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-32 bg-secondary rounded" />
          <div className="h-32 bg-secondary rounded" />
        </div>
        <div className="space-y-4">
          <div className="h-48 bg-secondary rounded" />
        </div>
      </div>
    </div>
  )
}

import {
  useCommunity,
  useCommunityPosts,
  useFollowedCommunities,
  useJoinCommunity,
} from '@/hooks/use-communities'

export default function CommunityPage(props: {
  params: Promise<{ subpost: string }>
}) {
  const [subpostValue, setSubpostValue] = useState<string | null>(null)

  // Resolve subpost Promise
  useEffect(() => {
    props.params.then((p) => setSubpostValue(p.subpost))
  }, [props.params])

  const {
    community,
    isLoading: communityLoading,
    isError: communityError,
  } = useCommunity(subpostValue)
  const {
    posts,
    isLoading: postsLoading,
    isError: postsError,
  } = useCommunityPosts(subpostValue)
  const { followedCommunities } = useFollowedCommunities()
  const { joinCommunity, isJoining: loadingJoin } = useJoinCommunity()

  const [joined, setJoined] = useState(false)

  useEffect(() => {
    if (community && followedCommunities) {
      setJoined(followedCommunities.some((c) => c.id === community.id))
    }
  }, [community, followedCommunities])

  const handleJoinToggle = async () => {
    if (!community) return
    // setJoined handled by effect on invalidation, but optimistic update is good U
    // For now rely on hook's invalidation which re-fetches followedCommunities

    try {
      if (!joined) {
        await joinCommunity(community.id)
        toast.success(`Joined r/${community.name}`)
        // setJoined(true) // Should be updated by effect
      } else {
        toast.error('Leave community not implemented')
      }
    } catch {
      toast.error('Failed to join community')
    }
  }

  if (!subpostValue || communityLoading) return <CommunitySkeleton />

  if (communityError || !community) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Failed to load community.</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  const username = community?.name || 'Unknown'

  return (
    <div className="min-h-screen bg-background">
      <div className="h-32 bg-gradient-to-r from-primary/30 to-primary/60 rounded-b-2xl" />

      <div className="w-full px-4 pb-20 lg:pb-4">
        <div className="relative -mt-16 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="h-32 w-32 rounded-full border-4 border-background bg-primary flex items-center justify-center">
              <span className="text-4xl font-bold text-primary-foreground">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold">{username}</h1>
              <p className="text-muted-foreground">r/{username}</p>
            </div>
            <div className="flex gap-2 pb-2">
              <Button
                variant={joined ? 'secondary' : 'default'}
                onClick={handleJoinToggle}
                disabled={loadingJoin}
              >
                {loadingJoin ? 'Processing...' : joined ? 'Joined' : 'Join'}
              </Button>

              <Link href={`/settings/community?cid=${community.id}`}>
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
                <TabsTrigger value="popular" className="rounded-full">
                  Popular
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts">
                {postsLoading ? (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      Loading posts...
                    </CardContent>
                  </Card>
                ) : postsError ? (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      Failed to load posts.
                    </CardContent>
                  </Card>
                ) : !Array.isArray(posts) || posts.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      No posts yet.
                    </CardContent>
                  </Card>
                ) : (
                  posts.map((post) => (
                    <PostCard
                      key={post.id}
                      id={post.id}
                      username={username}
                      cid={community.id}
                      title={post.title}
                      content={post.content || post.url}
                      subpost={community.name}
                      author={post.author}
                      upvotes={post.upvotes || 0}
                      commentCount={post.commentCount || 0}
                      timeAgo={new Date(post.createdAt).toLocaleString()}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="popular">
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    Popular tab not implemented yet
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold">About Community</h3>
                <p className="text-sm text-muted-foreground">
                  {community.description || 'No description provided.'}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Created:{' '}
                      {community.createdAt
                        ? new Date(community.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                  {community.author && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <PersonStandingIcon className="h-4 w-4" />
                      <span>Author: u/{community.author}</span>
                    </div>
                  )}
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
