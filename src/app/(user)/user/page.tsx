import { Header } from '@/components/header'
import { PostCard } from '@/components/post-card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Cake, Settings } from 'lucide-react'
import Link from 'next/link'
import { BottomNav } from '@/components/bottom-nav'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

const mockUserPosts = [
  {
    id: 'u1',
    title: 'Just released my first open source project after 6 months of work!',
    content:
      "I've been working on this project for the past 6 months and finally decided to open source it...",
    subreddit: 'programming',
    author: 'dev_enthusiast',
    upvotes: 15420,
    commentCount: 423,
    timeAgo: '5 hours ago',
  },
  {
    id: 'u2',
    title: "What's your favorite VS Code extension?",
    content:
      "I've been using VS Code for years now and always looking for new extensions to improve my workflow.",
    subreddit: 'webdev',
    author: 'dev_enthusiast',
    upvotes: 892,
    commentCount: 234,
    timeAgo: '2 days ago',
  },
]

export default async function UserProfilePage() {
  const session = await getServerSession(authOptions)
  const username =
    session?.user?.name || session?.user?.email?.split('@')[0] || 'User'

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="h-32 bg-gradient-to-r from-primary/30 to-primary/60" />

      <div className="max-w-4xl mx-auto px-4 pb-20 lg:pb-4">
        <div className="relative -mt-16 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="h-32 w-32 rounded-full border-4 border-background bg-primary flex items-center justify-center">
              <span className="text-4xl font-bold text-primary-foreground">
                {username?.charAt(0).toUpperCase()}
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
                <TabsTrigger value="saved" className="rounded-full">
                  Saved
                </TabsTrigger>
                <TabsTrigger value="upvoted" className="rounded-full">
                  Upvoted
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-3">
                {mockUserPosts.map((post) => (
                  <PostCard key={post.id} {...post} />
                ))}
              </TabsContent>

              <TabsContent value="comments">
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No comments yet
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="saved">
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No saved posts
                  </CardContent>
                </Card>
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
            {/* User Info Card */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold">About</h3>
                <p className="text-sm text-muted-foreground">
                  Just a friendly redditor who loves programming and cats.
                  Always learning something new!
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Cake className="h-4 w-4" />
                    <span>Cake Day: March 15, 2021</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>3 years on Reddit</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold">15.4k</p>
                    <p className="text-xs text-muted-foreground">Post Karma</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">8.2k</p>
                    <p className="text-xs text-muted-foreground">
                      Comment Karma
                    </p>
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
