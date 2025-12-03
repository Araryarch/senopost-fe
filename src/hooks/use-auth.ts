/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import api from '@/lib/api'

export function useAuth() {
  const { data: session, status, update } = useSession()

  const [user, setUser] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      if (status !== 'authenticated') return

      const provider =
        (session?.user as Record<string, unknown>)?.provider ??
        (session as unknown as Record<string, unknown>)?.provider ??
        'credentials'

      if (provider !== 'credentials') {
        const sessionUser = session?.user
          ? (session.user as Record<string, unknown>)
          : null

        setUser(sessionUser)
        return
      }

      setLoading(true)
      try {
        const token = (session?.user as Record<string, unknown>)?.accessToken

        const res = await api.get('/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const apiUser = res.data as Record<string, unknown>

        setUser({
          ...(session?.user as Record<string, unknown>),
          ...apiUser,
        })
      } catch (e) {
        setUser(
          session?.user ? (session.user as Record<string, unknown>) : null,
        )
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [session, status])

  return {
    session,
    status,
    isAuthenticated: status === 'authenticated',
    user,
    token: (session?.user as Record<string, unknown>)?.accessToken ?? null,
    loading,
    update,
  }
}
