/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Header } from '@/components/header'
import { BottomNav } from '@/components/bottom-nav'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CommunitySettingsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const communityId = searchParams.get('cid')

  const [community, setCommunity] = useState<any>(null)
  const [description, setDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!communityId) return
    const fetchCommunity = async () => {
      try {
        const res = await api.get(`/communities/${communityId}`)
        const data = res.data
        setCommunity(data)
        setDescription(data.description || '')
      } catch (err) {
        console.error(err)
        toast.error('Failed to fetch community data')
      }
    }
    fetchCommunity()
  }, [communityId])

  const handleSave = async () => {
    if (!communityId) return
    try {
      setIsSaving(true)
      await api.patch(`/communities/${communityId}`, { description })
      toast.success('Community description updated!')
      setIsSaving(false)
      router.refresh()
      router.push(`/r/${communityId}`)
    } catch (err) {
      console.error(err)
      toast.error('Failed to save description')
      setIsSaving(false)
    }
  }

  if (!communityId || !community) return <p>Loading...</p>

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-2xl mx-auto p-4 md:p-6 pb-20 lg:pb-6 overflow-y-auto scrollbar-hide">
        {/* Back button */}
        <div className="flex items-center mb-4">
          <Link
            href={`/r/${communityId}`}
            className="flex items-center text-primary hover:underline gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6">Community Settings</h1>

        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Community Info</CardTitle>
            <CardDescription>
              View your community info (only description is editable)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24">
                {community.avatar ? (
                  <Image
                    src={community.avatar}
                    alt="avatar"
                    width={200}
                    height={200}
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <AvatarFallback>{community.name[0]}</AvatarFallback>
                )}
              </Avatar>
              <div className="space-y-2 flex-1">
                <Label>Name</Label>
                <Input value={community.name} disabled />
              </div>
            </div>

            {/* Banner */}
            {community.banner && (
              <div className="space-y-2">
                <Label>Banner</Label>
                <Image
                  src={community.banner}
                  alt="banner"
                  width={600}
                  height={200}
                  className="w-full object-cover rounded-lg"
                />
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
              />
            </div>

            <Button
              className="rounded-full"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  )
}
