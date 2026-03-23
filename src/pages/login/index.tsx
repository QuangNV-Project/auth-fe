import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Link, useSearch, useNavigate } from '@tanstack/react-router'
import { useGoogleLogin } from '@react-oauth/google'
import { toast } from 'react-toastify'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '@/schema/loginSchema'
import { useLoginMutation } from '@/api/actions/auth/auth.mutations'
import { useCallback } from 'react'
import { LoginMutationResponse } from '@/api/actions/auth/auth.types'
import { Chrome } from 'lucide-react'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { redirectTo, state } = useSearch({
    strict: false,
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  const { mutateAsync: credentialLoginMutation } = useLoginMutation()

  const handleLogin = useCallback(
    async (data: LoginFormData) => {
      await credentialLoginMutation(
        {
          userName: data.username,
          password: data.password,
          redirectTo,
          state,
        },
        {
          onSuccess: (res: LoginMutationResponse) => {
            // Nếu có redirectTo thì chuyển về callback URL
            if (res.redirectTo) {
              window.location.href = `${res.redirectTo}/callback?code=${res.code}&state=${res.state}&type=ACCOUNT`
            } else {
              // Nếu không có redirectTo thì chuyển đến trang list-web
              navigate({
                to: '/callback',
                search: { code: res.code, type: 'ACCOUNT' },
              })
            }
            toast.success('Login successful')
          },
        },
      )
    },
    [credentialLoginMutation, navigate, redirectTo, state],
  )

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      if (redirectTo) {
        window.location.href = `${redirectTo}/callback?code=${codeResponse.code}&state=${state}&type=GOOGLE`
      } else {
        navigate({
          to: '/callback',
          search: { code: codeResponse.code, type: 'GOOGLE' },
        })
      }

      toast.success('Login successful')
    },
    onError: () => {
      toast.error('Google login failed')
    },
  })

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      <Card className="w-full max-w-md bg-black/50 text-white backdrop-blur-lg border border-gray-500">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-gray-200">
            Sign in to access your account and continue your journey.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(handleLogin)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="your_username"
                {...register('username')}
                className={`bg-black/20 border-gray-500 placeholder:text-gray-400 focus:ring-orange-500 ${errors.username ? 'border-red-500' : ''}`}
              />
              {errors.username && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className={`bg-black/20 border-gray-500 placeholder:text-gray-400 focus:ring-orange-500 ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-end">
              <Link
                to="/forgot-pass"
                className="text-sm text-orange-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-500" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/50 px-2 text-gray-300">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full bg-black/20 border-gray-500 hover:bg-black/40"
              onClick={() => googleLogin()}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Login with Google
            </Button>
            <p className="text-center text-sm text-gray-200">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-orange-400 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
