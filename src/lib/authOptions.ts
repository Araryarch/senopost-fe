import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { AxiosError } from 'axios'
import api from '@/lib/api'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials')
        }

        try {
          const res = await api.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
          })

          const { token, user_id } = res.data

          if (!token || !user_id) {
            throw new Error('Invalid response from backend')
          }

          return {
            id: user_id,
            email: credentials.email,
            token,
          }
        } catch (error: unknown) {
          const apiError = error as AxiosError<{ message: string }>
          throw new Error(apiError.response?.data?.message || 'Login failed')
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const userWithToken = user as {
          token?: string
          id?: string
          email?: string
        }
        if (userWithToken.token) token.accessToken = userWithToken.token
        token.id = userWithToken.id
        token.email = userWithToken.email
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        const sessionUser = session.user as { accessToken?: string }
        sessionUser.accessToken = token.accessToken as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
}
