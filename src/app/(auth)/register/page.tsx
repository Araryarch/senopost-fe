'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

// --------------------------------------
// ZOD SCHEMA (tambah username)
// --------------------------------------
const registerSchema = z
  .object({
    email: z.string().email('Email is invalid'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const router = useRouter()

  // --------------------------------------
  // Mutation
  // --------------------------------------
  const registerMutation = useMutation({
    mutationFn: async (payload: {
      email: string
      password: string
      username: string
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

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate({
      email: data.email,
      password: data.password,
      username: data.username,
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

            {/* Username (NEW, design tidak diubah) */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                className="h-11 rounded-full"
                {...register('username')}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
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
