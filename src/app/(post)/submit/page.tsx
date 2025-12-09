'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { FileText, Link2, ArrowLeft } from 'lucide-react'
import { BottomNav } from '@/components/bottom-nav'

import { useFollowedCommunities, Community } from '@/hooks/use-communities'
import { useCreatePost } from '@/hooks/use-posts'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function SubmitPage() {
  const [selectedCommunity, setSelectedCommunity] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [isNsfw, setIsNsfw] = useState(false)
  const [isSpoiler, setIsSpoiler] = useState(false)
  const router = useRouter()

  const { followedCommunities } = useFollowedCommunities()
  const { createPost, isCreating } = useCreatePost()

  const handleSubmit = async () => {
    if (!selectedCommunity) return

    try {
      await createPost({
        communityId: selectedCommunity,
        title,
        content: linkUrl ? undefined : content,
        url: linkUrl || undefined,
        nsfw: isNsfw,
        spoiler: isSpoiler,
      })

      toast.success('Post created!')
      router.push(`/r/${selectedCommunity}`) // Redirect is better UX than clearing form
    } catch {
      toast.error('Failed to create post')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto p-4 md:p-6 pb-20 lg:pb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Feed
          </Button>
        </Link>

        <h1 className="text-2xl font-bold mb-6">Create a Post</h1>

        <div className="mb-6">
          <Select
            value={selectedCommunity}
            onValueChange={setSelectedCommunity}
          >
            <SelectTrigger className="w-full max-w-xs rounded-full">
              <SelectValue placeholder="Choose a community" />
            </SelectTrigger>
            <SelectContent>
              {followedCommunities?.map((community: Community) => (
                <SelectItem key={community.id} value={community.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">r/{community.name}</span>
                    {/* members not available in type */}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="post" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
                <TabsTrigger
                  value="post"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2 px-6 py-3"
                >
                  <FileText className="h-4 w-4" />
                  Post
                </TabsTrigger>
                <TabsTrigger
                  value="link"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2 px-6 py-3"
                >
                  <Link2 className="h-4 w-4" />
                  Link
                </TabsTrigger>
              </TabsList>

              <TabsContent value="post" className="p-4 space-y-4">
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium"
                  maxLength={300}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {title.length}/300
                </p>
                <Textarea
                  placeholder="Text (optional)"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </TabsContent>

              <TabsContent value="link" className="p-4 space-y-4">
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium"
                  maxLength={300}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {title.length}/300
                </p>
                <Input
                  placeholder="URL"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  type="url"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardContent className="p-4 flex gap-6">
            <div className="flex items-center gap-2">
              <Switch id="nsfw" checked={isNsfw} onCheckedChange={setIsNsfw} />
              <Label htmlFor="nsfw" className="text-sm font-medium">
                NSFW
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="spoiler"
                checked={isSpoiler}
                onCheckedChange={setIsSpoiler}
              />
              <Label htmlFor="spoiler" className="text-sm font-medium">
                Spoiler
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            disabled
            variant="outline"
            className="rounded-full bg-transparent"
          >
            Save Draft
          </Button>
          <Button
            className="rounded-full cursor-pointer"
            disabled={!title || !selectedCommunity}
            onClick={handleSubmit}
          >
            {isCreating ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
