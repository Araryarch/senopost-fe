'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeOff, Github } from 'lucide-react'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

// --------------------------------------
// ZOD SCHEMA
// --------------------------------------
const registerSchema = z
  .object({
    email: z.string().email('Email is invalid'),
    password: z.string().min(6, 'Password must be at least 6 chars'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)

  // --------------------------------------
  // React Hook Form
  // --------------------------------------
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const router = useRouter()

  // --------------------------------------
  // Mutation (React Query)
  // --------------------------------------
  const registerMutation = useMutation({
    mutationFn: async (payload: {
      email: string
      password: string
      nickname?: string
    }) => {
      const res = await api.post('/auth/register', payload)
      return res.data
    },
    onSuccess: () => {
      toast.success('Account created!')
      router.push('/login')
    },
    onError: () => {
      toast.error('Failed to register')
    },
  })

  // --------------------------------------
  // Submit handler
  // --------------------------------------
  // generate a simple nickname from email local part + random number
  const generateNickname = (email: string) => {
    const local = email.split('@')[0] || 'user'
    const cleaned = local.replace(/[^a-zA-Z0-9]/g, '')
    const suffix = Math.floor(1000 + Math.random() * 9000)
    return `${cleaned || 'user'}${suffix}`.toLowerCase()
  }

  const onSubmit = (data: RegisterForm) => {
    const nickname = generateNickname(data.email)
    registerMutation.mutate({
      email: data.email,
      password: data.password,
      nickname,
    })
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="w-full h-full relative z-10 flex flex-col justify-center items-center text-primary-foreground">
          <h1 className="text-4xl font-bold text-center mb-4">
            Join the community
          </h1>
          <p className="text-lg text-center text-primary-foreground/80 max-w-md">
            Connect with millions of people and discover countless communities
            sharing your interests.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Sign Up</h2>
            <p className="text-muted-foreground mt-2">
              Create an account to join communities and start posting.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              onClick={() => signIn('github')}
              variant="outline"
              className="w-full h-11 rounded-full gap-3 bg-transparent cursor-pointer"
            >
              <Github />
              Continue with Github
            </Button>
          </div>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground uppercase">
              or
            </span>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                className="h-11 rounded-full"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="h-11 rounded-full pr-10"
                  {...register('password')}
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
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                className="h-11 rounded-full"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 rounded-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Loading…' : 'Sign Up'}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm">
            Already a Senoposter?
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline ml-1"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
