import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { useSession } from 'next-auth/react'

interface UseVoteProps {
  id: string
  initialUpvotes: number
  initialVoteStatus?: 'up' | 'down' | null
  type: 'post' | 'comment'
  postId?: string // Required for comment invalidation if comments are fetched by postId
}

export function useVote({
  id,
  initialUpvotes,
  initialVoteStatus = null,
  type,
  postId,
}: UseVoteProps) {
  const queryClient = useQueryClient()
  const { status } = useSession()
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(
    initialVoteStatus,
  )
  const [voteCount, setVoteCount] = useState(0)

  // Sync local state when server data updates (e.g. after invalidation)
  useEffect(() => {
    setVoteStatus(initialVoteStatus)
    setVoteCount(0)
  }, [initialUpvotes, initialVoteStatus])

  const handleVote = async (voteType: 'up' | 'down') => {
    if (status !== 'authenticated') {
      toast.error('You must be logged in to vote')
      return
    }

    const previousVoteStatus = voteStatus
    const previousVoteCount = voteCount

    try {
      let newVoteStatus: 'up' | 'down' | null = voteType
      let voteDelta = 0

      if (voteStatus === null) {
        voteDelta = voteType === 'up' ? 1 : -1
        newVoteStatus = voteType
      } else if (voteStatus === voteType) {
        voteDelta = voteType === 'up' ? -1 : 1
        newVoteStatus = null
      } else {
        // switching vote
        voteDelta = voteType === 'up' ? 2 : -2
        newVoteStatus = voteType
      }

      setVoteStatus(newVoteStatus)
      setVoteCount(previousVoteCount + voteDelta)

      let value = 0
      if (newVoteStatus === 'up') value = 1
      else if (newVoteStatus === 'down') value = -1

      const endpoint =
        type === 'post' ? `/posts/${id}/votes` : `/comments/${id}/votes`

      await api.post(endpoint, { value })

      // Invalidate queries
      if (type === 'post') {
        queryClient.invalidateQueries({ queryKey: ['posts'] })
        queryClient.invalidateQueries({ queryKey: ['post', id] })
      } else {
        // for comments, we often invalidate the 'comments' of the post
        if (postId) {
          queryClient.invalidateQueries({ queryKey: ['comments', postId] })
        }
      }
    } catch (err) {
      console.error('Failed to vote:', err)
      setVoteStatus(previousVoteStatus)
      setVoteCount(previousVoteCount)
      toast.error('Vote failed')
    }
  }

  const currentVotes = initialUpvotes + voteCount

  return {
    voteStatus,
    voteCount,
    currentVotes,
    handleVote,
  }
}
