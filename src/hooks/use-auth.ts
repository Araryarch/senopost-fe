/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Session } from 'next-auth'

export function useAuth() {
  const { data: session, status, update } = useSession()
  const [user, setUser] = useState<Session['user'] | null>(
    session?.user ?? null,
  )
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      if (status !== 'authenticated') return

      const provider = session?.user.provider ?? session?.provider

      if (provider === 'credentials') {
        setLoading(true)
        try {
          const res = await api.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          })
          setUser(res.data)
        } catch (e) {
          setUser(session?.user)
        } finally {
          setLoading(false)
        }
      } else {
        setUser(session?.user)
      }
    }

    fetchUser()
  }, [session, status])

  return {
    session,
    status,
    isAuthenticated: status === 'authenticated',
    user,
    token: session?.user?.accessToken,
    loading,
    update,
  }
}
