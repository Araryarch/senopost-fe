'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

interface CommunityInterface {
  id: string
  name: string
  description: string
  creatorId: string
  createdAt: string
  updatedAt: string
}

interface PostInterface {
  id: string
  title: string
  subpost: string
  upvotes: number
}

export function RightSidebar() {
  // Fetch trending communities
  const { data: trendingCommunities = [] } = useQuery<CommunityInterface[]>({
    queryKey: ['communities'],
    queryFn: async () => {
      const res = await api.get('/communities')
      return res.data
    },
    staleTime: 1000 * 60 * 5,
  })

  // Fetch popular posts
  const { data: popularPosts = [] } = useQuery<PostInterface[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await api.get('/posts')
      return res.data
    },
  })

  return (
    <aside className="w-[312px] h-[calc(100vh-48px)] sticky top-12 hidden xl:block p-4">
      <ScrollArea className="h-full pr-1">
        {/* Trending Communities */}
        <Card className="border-border mb-5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-primary" />
              Trending Communities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trendingCommunities.length ? (
              trendingCommunities.map((community, index) => (
                <Link
                  key={community.id}
                  href={`/r/${community.id}`}
                  className="flex items-center gap-3 hover:bg-secondary p-2 rounded-lg -mx-2 transition-colors"
                >
                  <span className="text-sm font-medium text-muted-foreground w-4">
                    {index + 1}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-foreground">
                      {community.name.charAt(0).toUpperCase()}{' '}
                      {/* fixed charAt index */}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {community.name}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No trending communities
              </p>
            )}
          </CardContent>
        </Card>

        {/* Popular Posts */}
        <Card className="border-border mb-5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Users className="h-4 w-4 text-primary" />
              Popular Today
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {popularPosts.length ? (
              popularPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/r/${post.subpost}/comments/${post.id}`}
                  className="block hover:bg-secondary p-2 rounded-lg -mx-2 transition-colors"
                >
                  <p className="text-sm font-medium line-clamp-2 mb-1">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>r/{post.subpost}</span>
                    <span>•</span>
                    <span>{post.upvotes} upvotes</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">
                Please refresh
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Community */}
        <Card className="border-border bg-secondary/50">
          <CardContent className="pt-4">
            <h3 className="font-semibold mb-2">Create Your Community</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Start your own community and connect with people who share your
              interests.
            </p>
            <Button className="w-full rounded-full" size="sm">
              Create Community
            </Button>
          </CardContent>
        </Card>
      </ScrollArea>
    </aside>
  )
}
