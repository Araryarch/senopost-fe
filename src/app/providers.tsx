'use client'

import {
  QueryClient,
  QueryClientProvider,
  QueryOptions,
} from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'

import api from '@/lib/api'
import { ThemeProvider } from '@/components/theme-provider'

const defaultQueryFn = async ({ queryKey }: QueryOptions) => {
  const { data } = await api.get(`${queryKey?.[0]}`)
  return data
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
})

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/rest-api/auth">
      <ThemeProvider attribute="class" defaultTheme="system">
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-center" />
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
