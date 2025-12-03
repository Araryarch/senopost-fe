'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Bell, Shield, Eye } from 'lucide-react'
import { BottomNav } from '@/components/bottom-nav'

export default function ProfileSettingsPage() {
  const { user } = useAuth()
  const sessionUser = user as { name?: string; email?: string } | undefined

  const [displayName, setDisplayName] = useState<string>(
    sessionUser?.name || (sessionUser?.email?.split('@')[0] ?? 'John Doe'),
  )
  const [about, setAbout] = useState(
    'Just a friendly redditor who loves programming and cats.',
  )

  useEffect(() => {
    if (sessionUser?.name) setDisplayName(sessionUser.name)
    else if (sessionUser?.email) setDisplayName(sessionUser.email.split('@')[0])
  }, [sessionUser?.name, sessionUser?.email])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto p-4 md:p-6 pb-20 lg:pb-6 overflow-y-auto scrollbar-hide">
        <h1 className="text-2xl font-bold mb-6">User Settings</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-secondary p-1 rounded-full w-full justify-start overflow-x-auto scrollbar-hide">
            <TabsTrigger value="profile" className="rounded-full gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-full gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="rounded-full gap-2">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="feed" className="rounded-full gap-2">
              <Eye className="h-4 w-4" />
              Feed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Avatar Section - Simplified without image upload */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Avatar</CardTitle>
                <CardDescription>
                  Your profile avatar displayed across the site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {displayName
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Avatar is generated from your display name initials
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update your profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Display name"
                    className="max-w-md"
                  />
                  <p className="text-xs text-muted-foreground">
                    This is how your name will appear to others
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about">About (Bio)</Label>
                  <Textarea
                    id="about"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="max-w-md resize-none"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    {about.length}/200 characters
                  </p>
                </div>

                <Button className="rounded-full">Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>
                  Add links to your other social profiles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter/X</Label>
                    <Input id="twitter" placeholder="@username" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input id="github" placeholder="username" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" placeholder="https://example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input id="instagram" placeholder="@username" />
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full bg-transparent"
                >
                  + Add Custom Link
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Upvotes on your posts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone upvotes your posts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Comments on your posts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone comments on your posts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Replies to your comments</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone replies to your comments
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New followers</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone follows you
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Direct messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you receive a direct message
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control who can see your activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show active communities</Label>
                    <p className="text-sm text-muted-foreground">
                      Let others see which communities you&apos;re active in
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow followers</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow other users to follow you
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show online status</Label>
                    <p className="text-sm text-muted-foreground">
                      Show when you&apos;re online
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow direct messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Let others send you direct messages
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Feed Settings</CardTitle>
                <CardDescription>
                  Customize your feed experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show NSFW content</Label>
                    <p className="text-sm text-muted-foreground">
                      Show content marked as NSFW
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Reduce animations</Label>
                    <p className="text-sm text-muted-foreground">
                      Reduce motion for accessibility
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <BottomNav />
    </div>
  )
}
