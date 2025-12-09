import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '@/lib/api'

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
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(
    initialVoteStatus,
  )
  const [voteCount, setVoteCount] = useState(0)

  const handleVote = async (voteType: 'up' | 'down') => {
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
