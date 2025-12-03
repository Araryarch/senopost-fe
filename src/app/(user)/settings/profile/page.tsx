/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { BottomNav } from '@/components/bottom-nav'
import { User, Bell, Shield, Eye } from 'lucide-react'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function ProfileSettingsPage() {
  const { user } = useAuth()
  const router = useRouter()

  const sessionUser = user as any

  const [displayName, setDisplayName] = useState('')
  const [about, setAbout] = useState('')
  const [twitter, setTwitter] = useState('')
  const [github, setGithub] = useState('')
  const [website, setWebsite] = useState('')
  const [instagram, setInstagram] = useState('')

  const [nsfwEnabled, setNsfwEnabled] = useState(false)
  const [spoilerEnabled, setSpoilerEnabled] = useState(false)

  const [photoPreview, setPhotoPreview] = useState(sessionUser?.photo || '')
  const [photoBase64, setPhotoBase64] = useState('')
  const [isPhotoChanged, setIsPhotoChanged] = useState(false)

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!sessionUser) return

    setDisplayName(
      sessionUser.username || sessionUser.email?.split('@')[0] || 'User',
    )

    setAbout(sessionUser.bio || '')

    setTwitter(sessionUser.linkX || '')
    setGithub(sessionUser.linkGithub || '')
    setWebsite(sessionUser.linkWebsite || '')
    setInstagram(sessionUser.linkInstagram || '')

    setNsfwEnabled(sessionUser.nsfwEnabled ?? false)
    setSpoilerEnabled(sessionUser.spoilerEnabled ?? false)

    setPhotoPreview(sessionUser.photo || '')
  }, [sessionUser])

  // HANDLE FILE UPLOAD AND CONVERT TO BASE64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setPhotoPreview(base64String) // Full data URL for preview
        setPhotoBase64(base64String.split(',')[1]) // Pure base64 for patch
        setIsPhotoChanged(true)
      }
      reader.readAsDataURL(file)
    }
  }

  // ------------------------------------------------
  // 🔥 SAVE HANDLER (PATCH /me)
  // ------------------------------------------------
  const handleSave = async () => {
    try {
      setIsSaving(true)

      const payload: any = {
        username: displayName,
        bio: about,
        linkX: twitter,
        linkGithub: github,
        linkWebsite: website,
        linkInstagram: instagram,
        nsfwEnabled,
        spoilerEnabled,
      }

      if (isPhotoChanged && photoBase64) {
        payload.photo = photoBase64 // Send pure base64 string
      }

      await api.patch('/me', payload)

      setIsSaving(false)
      toast.success('Profile updated successfully!')
      await router.refresh()
    } catch (err) {
      setIsSaving(false)
      console.error(err)
      alert('Failed to save changes')
    }
  }

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

          {/* PROFILE */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Avatar</CardTitle>
                <CardDescription>Your profile avatar</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    {photoPreview ? (
                      <Image
                        src={photoPreview}
                        alt="pp"
                        width={200}
                        height={200}
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                        {displayName
                          .split(' ')
                          .map((x) => x[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className="space-y-2">
                    <Label htmlFor="avatar-upload">Upload Avatar</Label>
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      disabled={true}
                      onChange={handleFileChange}
                      className="max-w-md"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* BASIC INFO */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Edit your profile</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="max-w-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label>About (Bio)</Label>
                  <Textarea
                    rows={4}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="max-w-md resize-none"
                  />
                </div>

                <Button
                  className="rounded-full"
                  disabled={isSaving}
                  onClick={handleSave}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            {/* SOCIAL LINKS */}
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Connect your social accounts</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Twitter/X</Label>
                    <Input
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="@username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>GitHub</Label>
                    <Input
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@username"
                    />
                  </div>
                </div>

                <Button
                  className="rounded-full"
                  disabled={isSaving}
                  onClick={handleSave}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FEED SETTINGS */}
          <TabsContent value="feed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Feed Settings</CardTitle>
                <CardDescription>Customize content visibility</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show NSFW content</Label>
                    <p className="text-sm text-muted-foreground">
                      Show content marked as NSFW
                    </p>
                  </div>

                  <Switch
                    checked={nsfwEnabled}
                    onCheckedChange={setNsfwEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Spoilers</Label>
                    <p className="text-sm text-muted-foreground">
                      Blur spoiler content
                    </p>
                  </div>

                  <Switch
                    checked={spoilerEnabled}
                    onCheckedChange={setSpoilerEnabled}
                  />
                </div>

                <Button
                  className="rounded-full"
                  disabled={isSaving}
                  onClick={handleSave}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  )
}
