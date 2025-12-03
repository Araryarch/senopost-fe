'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { BottomNav } from '@/components/bottom-nav'
import api from '@/lib/api'

export default function CreateCommunityPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleCreate = async () => {
    if (!name) return

    try {
      setIsSaving(true)
      const res = await api.post('/communities', { name, description })
      setIsSaving(false)
      toast.success('Community created successfully!')

      const communityId = res.data.id
      router.refresh()
      router.push(`/r/${communityId}`)
    } catch (err) {
      setIsSaving(false)
      console.error(err)
      toast.error('Failed to create community')
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

        <h1 className="text-2xl font-bold mb-6">Create a Community</h1>

        <Card>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="community-name">Community Name</Label>
              <Input
                id="community-name"
                placeholder="Enter community name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground text-right">
                {name.length}/50
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="community-description">Description</Label>
              <Textarea
                id="community-description"
                placeholder="Write a short description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex justify-end mt-4">
              <Button
                className="rounded-full"
                onClick={handleCreate}
                disabled={!name || isSaving}
              >
                {isSaving ? 'Creating...' : 'Create Community'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
