'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/reddit-community-illustration-abstract.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-primary-foreground">
          <div className="w-24 h-24 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-8">
            <svg viewBox="0 0 20 20" className="w-16 h-16 fill-current">
              <path d="M16.5 8.5c0-1.1-.9-2-2-2-.5 0-1 .2-1.4.5-1.3-.9-3-1.4-4.9-1.5l1-3.1 2.7.6c0 .8.6 1.5 1.5 1.5.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5c-.6 0-1.1.3-1.3.8L9.3 1.5c-.2 0-.3.1-.4.3l-1.2 3.7c-2 .1-3.8.6-5.2 1.5-.4-.3-.9-.5-1.4-.5-1.1 0-2 .9-2 2 0 .7.4 1.4 1 1.7-.1.3-.1.7-.1 1 0 3.3 3.8 6 8.5 6s8.5-2.7 8.5-6c0-.3 0-.7-.1-1 .6-.3 1-1 1-1.7zM5 11c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5-.7 1.5-1.5 1.5S5 11.8 5 11zm8.1 3.3c-1 1-2.5 1.2-3.6 1.2s-2.6-.2-3.6-1.2c-.2-.2-.2-.5 0-.7.2-.2.5-.2.7 0 .7.7 1.8.9 2.9.9s2.2-.2 2.9-.9c.2-.2.5-.2.7 0 .2.2.2.5 0 .7zm-.1-1.8c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-center mb-4">
            Join the community
          </h1>
          <p className="text-lg text-center text-primary-foreground/80 max-w-md">
            Connect with millions of people and discover countless communities
            sharing your interests.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Logo for mobile */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <svg
                  viewBox="0 0 20 20"
                  className="w-6 h-6 text-primary-foreground fill-current"
                >
                  <path d="M16.5 8.5c0-1.1-.9-2-2-2-.5 0-1 .2-1.4.5-1.3-.9-3-1.4-4.9-1.5l1-3.1 2.7.6c0 .8.6 1.5 1.5 1.5.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5c-.6 0-1.1.3-1.3.8L9.3 1.5c-.2 0-.3.1-.4.3l-1.2 3.7c-2 .1-3.8.6-5.2 1.5-.4-.3-.9-.5-1.4-.5-1.1 0-2 .9-2 2 0 .7.4 1.4 1 1.7-.1.3-.1.7-.1 1 0 3.3 3.8 6 8.5 6s8.5-2.7 8.5-6c0-.3 0-.7-.1-1 .6-.3 1-1 1-1.7zM5 11c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5-.7 1.5-1.5 1.5S5 11.8 5 11zm8.1 3.3c-1 1-2.5 1.2-3.6 1.2s-2.6-.2-3.6-1.2c-.2-.2-.2-.5 0-.7.2-.2.5-.2.7 0 .7.7 1.8.9 2.9.9s2.2-.2 2.9-.9c.2-.2.5-.2.7 0 .2.2.2.5 0 .7zm-.1-1.8c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-primary">reddit</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold">Sign Up</h2>
            <p className="text-muted-foreground mt-2">
              Create an account to join communities and start posting.
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-11 rounded-full gap-3 bg-transparent"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full h-11 rounded-full gap-3 bg-transparent"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
              Continue with Apple
            </Button>
          </div>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground uppercase">
              or
            </span>
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                className="h-11 rounded-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                className="h-11 rounded-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="h-11 rounded-full pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 rounded-full">
              Sign Up
            </Button>
          </form>

          {/* Toggle to Login */}
          <p className="text-center text-sm">
            Already a redditor?{' '}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
