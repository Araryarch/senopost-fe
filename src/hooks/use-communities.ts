import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

export interface Community {
  id: string
  name: string
  description?: string
  creatorId?: string
  createdAt?: string
  updatedAt?: string
  author?: string // Backend inconsistency handling
}

export function useCommunities() {
  const { data: communities = [], isLoading } = useQuery({
    queryKey: ['communities'],
    queryFn: async () => {
      const res = await api.get('/communities')
      return res.data as Community[]
    },
    staleTime: 1000 * 60 * 5,
  })

  return { communities, isLoading }
}

export function useCommunity(nameOrId: string | null) {
  const queryFn = async () => {
    if (!nameOrId) return null
    const res = await api.get(`/communities/${nameOrId}`)
    return res.data as Community
  }

  const {
    data: community,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['community', nameOrId],
    queryFn,
    enabled: !!nameOrId,
    retry: 1,
  })

  return { community, isLoading, isError }
}

export function useCommunityPosts(nameOrId: string | null) {
  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['posts', nameOrId],
    queryFn: async () => {
      if (!nameOrId) return []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await api.get<{ posts: any[] }>(
        `/communities/${nameOrId}/posts`,
      )
      return Array.isArray(res.data.posts) ? res.data.posts : []
    },
    enabled: !!nameOrId,
  })

  return { posts, isLoading, isError }
}

export function useFollowedCommunities() {
  const { data: followedCommunities = [], isLoading } = useQuery({
    queryKey: ['followedCommunities'],
    queryFn: async () => {
      const res = await api.get<Community[]>('/followed')
      return res.data
    },
  })

  return { followedCommunities, isLoading }
}

export function useJoinCommunity() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (communityId: string) => {
      await api.post('/follow', { communityId })
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['followedCommunities'] })
      // Optionally update local cache if we had a detailed community object
    },
  })

  return {
    joinCommunity: mutation.mutateAsync,
    isJoining: mutation.isPending,
  }
}
