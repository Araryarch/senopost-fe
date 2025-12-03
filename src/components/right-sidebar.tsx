'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

const trendingCommunities = [
  { name: 'r/programming', members: '6.2M', growth: '+12%' },
  { name: 'r/technology', members: '15.1M', growth: '+8%' },
  { name: 'r/science', members: '31.2M', growth: '+5%' },
  { name: 'r/gaming', members: '38.4M', growth: '+15%' },
  { name: 'r/movies', members: '32.1M', growth: '+3%' },
]

const popularPosts = [
  {
    title: "What's the most underrated programming language?",
    subreddit: 'programming',
    upvotes: '12.4k',
  },
  {
    title: 'Scientists discover new species in deep ocean',
    subreddit: 'science',
    upvotes: '45.2k',
  },
  { title: 'Best games of 2024 so far?', subreddit: 'gaming', upvotes: '8.7k' },
]

export function RightSidebar() {
  return (
    <aside className="w-[312px] h-[calc(100vh-48px)] sticky top-12 hidden xl:block p-4">
      <ScrollArea className="h-full pr-1">
        <Card className="border-border mb-5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-primary" />
              Trending Communities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trendingCommunities.map((community, index) => (
              <Link
                key={community.name}
                href={`/${community.name}`}
                className="flex items-center gap-3 hover:bg-secondary p-2 rounded-lg -mx-2 transition-colors"
              >
                <span className="text-sm font-medium text-muted-foreground w-4">
                  {index + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">
                    {community.name.charAt(2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {community.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {community.members} members
                  </p>
                </div>
                <span className="text-xs text-green-600 font-medium">
                  {community.growth}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border mb-5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Users className="h-4 w-4 text-primary" />
              Popular Today
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {popularPosts.map((post, index) => (
              <Link
                key={index}
                href="#"
                className="block hover:bg-secondary p-2 rounded-lg -mx-2 transition-colors"
              >
                <p className="text-sm font-medium line-clamp-2 mb-1">
                  {post.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>r/{post.subreddit}</span>
                  <span>•</span>
                  <span>{post.upvotes} upvotes</span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

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
