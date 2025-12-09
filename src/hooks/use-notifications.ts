import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export interface Notification {
  id: string
  userId: string
  message: string
  isRead: boolean
  createdAt: string
  postId?: string
  communityId?: string
}

export function useNotifications() {
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      // Mocking the endpoint or using a real one if it exists.
      // Assuming a generic /notifications endpoint
      try {
        const res = await api.get('/notifications')
        return res.data as Notification[]
      } catch {
        return []
      }
    },
    // Poll every minute
    refetchInterval: 60000,
  })

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length

  return { notifications, unreadCount, isLoading }
}
