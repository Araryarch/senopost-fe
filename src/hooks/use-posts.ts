import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export interface Post {
  id: string
  title: string
  content?: string
  url?: string
  author: string
  community: {
    id: string
    name: string
  }
  upvotes: number
  commentCount: number
  createdAt: string
  timeAgo: string
}

export function usePosts() {
  const queryClient = useQueryClient()

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await api.get('/posts')
      return res.data as Post[]
    },
  })

  // Delete Post Mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/posts/${id}`)
    },
    onSuccess: (data, id) => {
      toast.success('Post deleted successfully')
      queryClient.setQueryData(['posts'], (old: Post[] | undefined) =>
        old ? old.filter((post) => post.id !== id) : [],
      )
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onError: (err) => {
      toast.error('Failed to delete post')
      console.error(err)
    },
  })

  return {
    posts,
    isLoading,
    error,
    deletePost: deletePostMutation.mutateAsync,
    isDeleting: deletePostMutation.isPending,
  }
}

export function usePost(id: string) {
  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await api.get(`/posts/${id}`)
      return res.data as Post
    },
    enabled: !!id,
  })

  return { post, isLoading, error }
}

export function useCreatePost() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: {
      title: string
      content?: string
      url?: string
      communityId: string
      nsfw: boolean
      spoiler: boolean
    }) => {
      const { communityId, ...payload } = data
      await api.post(`/communities/${communityId}/posts`, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  return {
    createPost: mutation.mutateAsync,
    isCreating: mutation.isPending,
  }
}
