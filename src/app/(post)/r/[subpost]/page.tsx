'use client'

import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Settings } from 'lucide-react'
import Link from 'next/link'
import { BottomNav } from '@/components/bottom-nav'
import api from '@/lib/api'
import React from 'react'

interface Community {
  id: string
  name: string
  description: string
  createdAt: string
}

// Skeleton component
function CommunitySkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-32 bg-gray-300 rounded-b-2xl mb-6" />
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
        <div className="h-32 w-32 rounded-full bg-gray-300" />
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-gray-300 w-1/3 rounded" />
          <div className="h-4 bg-gray-300 w-1/2 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-32 bg-gray-300 rounded" />
          <div className="h-32 bg-gray-300 rounded" />
        </div>
        <div className="space-y-4">
          <div className="h-48 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  )
}

export default function CommunityPage(props: {
  params: Promise<{ subpost: string; id: string }>
}) {
  const { subpost } = React.use(props.params)

  const {
    data: community,
    isLoading,
    isError,
  } = useQuery<Community>({
    queryKey: ['community', subpost],
    queryFn: async () => {
      const res = await api.get<Community>(`/communities/${subpost}`)
      return res.data
    },
    retry: 3,
    retryDelay: 2000,
  })

  const [joined, setJoined] = React.useState(false)

  if (!subpost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Invalid community ID</p>
      </div>
    )
  }

  if (isLoading) return <CommunitySkeleton />

  if (isError || !community) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Failed to load community.</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  const username = community.name

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
              <p className="text-muted-foreground">Community: {username}</p>
            </div>
            <div className="flex gap-2 pb-2">
              <Button
                variant={joined ? 'secondary' : 'default'}
                onClick={() => setJoined(!joined)}
              >
                {joined ? 'Joined' : 'Join'}
              </Button>

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
                <TabsTrigger value="popular" className="rounded-full">
                  Popular
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts">
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground"></CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="popular">
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground"></CardContent>
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
                      {new Date(community.createdAt).toLocaleDateString()}
                    </span>
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
