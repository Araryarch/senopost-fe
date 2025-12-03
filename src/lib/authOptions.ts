import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import { AxiosError } from 'axios'
import api from '@/lib/api'

export const authOptions: NextAuthOptions = {
  providers: [
    // GitHub OAuth
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
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
    async jwt({ token, user, account }) {
      // If OAuth provider returned an access token (e.g., GitHub), store it
      if (account?.access_token) {
        token.accessToken = account.access_token as string
      }

      // For credential provider, the `user` may contain backend token
      if (user) {
        const userWithToken = user as {
          token?: string
          id?: string
          email?: string
        }
        // credential flow returns token property on user
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}
