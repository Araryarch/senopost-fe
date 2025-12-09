import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

export function useComments(postId: string | undefined) {
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      if (!postId) return []
      try {
        const res = await api.get(`/posts/${postId}/comments`)
        return res.data
      } catch (error) {
        console.error(error)
        return []
      }
    },
    enabled: !!postId,
  })

  return { comments, isLoading }
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({
      content,
      parentId,
    }: {
      content: string
      parentId?: string
    }) => {
      await api.post(`/posts/${postId}/comments`, { content, parentId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })

  return {
    createComment: mutation.mutateAsync,
    isCreating: mutation.isPending,
  }
}
