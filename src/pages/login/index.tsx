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
import { ArrowRight, Chrome, ShieldCheck, Sparkles } from 'lucide-react'

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
    <div className="app-canvas flex items-center justify-center p-5 sm:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 shadow-2xl shadow-primary/10 backdrop-blur-xl lg:grid-cols-[1.05fr_.95fr]">
        <section className="hidden min-h-[640px] flex-col justify-between bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-10 text-white lg:flex">
          <div className="flex items-center gap-3 font-semibold tracking-wide"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15"><ShieldCheck className="h-5 w-5" /></span>ACCESS PORTAL</div>
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm"><Sparkles className="h-4 w-4" /> A simpler way to sign in</span>
            <h1 className="max-w-md text-5xl font-semibold leading-tight">Everything you need, one secure place.</h1>
            <p className="max-w-sm text-base leading-7 text-white/75">Connect to the products you have access to with a clean, protected account experience.</p>
          </div>
          <p className="text-sm text-white/60">Secure access, designed for focus.</p>
        </section>
        <Card className="flex min-h-[640px] w-full flex-col justify-center rounded-none border-0 bg-transparent shadow-none">
          <CardHeader className="space-y-3 px-7 sm:px-12">
            <span className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[.16em] text-primary lg:hidden"><ShieldCheck className="h-3.5 w-3.5" /> Access portal</span>
            <CardTitle className="text-3xl font-semibold tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-base leading-6">Sign in to continue to your workspace.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(handleLogin)}>
          <CardContent className="space-y-5 px-7 sm:px-12">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="your_username"
                {...register('username')}
                className={`h-11 bg-background/70 ${errors.username ? 'border-destructive' : ''}`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-destructive">
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
                className={`h-11 bg-background/70 ${errors.password ? 'border-destructive' : ''}`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-end">
              <Link
                to="/forgot-pass"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-5 px-7 pb-7 sm:px-12 sm:pb-12">
            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-primary font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : <>Login <ArrowRight className="h-4 w-4" /></>}
            </Button>
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-xl bg-background/50"
              onClick={() => googleLogin()}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Login with Google
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
        </Card>
      </div>
    </div>
  )
}
