import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useGoogleLogin } from '@react-oauth/google'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '@/schema/loginSchema'
import { useLoginMutation } from '@/api/actions/auth/auth.mutations'
import { useCallback, useState } from 'react'
import { LoginMutationResponse } from '@/api/actions/auth/auth.types'
import { ArrowRight, Eye, EyeOff, Fingerprint, Globe2, Layers3, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { redirectTo, state } = useSearch({ strict: false })
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema), mode: 'onChange' })
  const { mutateAsync: credentialLoginMutation } = useLoginMutation()

  const handleLogin = useCallback(async (data: LoginFormData) => {
    await credentialLoginMutation(
      { userName: data.username, password: data.password, redirectTo, state },
      {
        onSuccess: (res: LoginMutationResponse) => {
          if (res.redirectTo) {
            window.location.href = `${res.redirectTo}/callback?code=${res.code}&state=${res.state}&type=ACCOUNT`
          } else {
            navigate({ to: '/callback', search: { code: res.code, type: 'ACCOUNT' } })
          }
          toast.success('Login successful')
        },
      },
    )
  }, [credentialLoginMutation, navigate, redirectTo, state])

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      if (redirectTo) {
        window.location.href = `${redirectTo}/callback?code=${codeResponse.code}&state=${state}&type=GOOGLE`
      } else {
        navigate({ to: '/callback', search: { code: codeResponse.code, type: 'GOOGLE' } })
      }
      toast.success('Login successful')
    },
    onError: () => toast.error('Google login failed'),
  })

  return (
    <main className="portal-page min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="portal-shell mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-[1320px] overflow-hidden rounded-[30px] border border-border/70 bg-card shadow-[0_28px_100px_-45px_rgba(21,35,69,.45)] lg:grid-cols-[1.04fr_.96fr]">
        <section className="portal-showcase relative hidden min-h-[680px] flex-col justify-between overflow-hidden p-9 text-white lg:flex xl:p-12">
          <div className="portal-grid" aria-hidden="true" />
          <div className="relative z-10 flex items-center gap-3 text-sm font-bold tracking-[.2em]">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20"><Layers3 className="h-5 w-5" /></span>
            ACCESS PORTAL
          </div>
          <div className="portal-visual relative z-10 mx-auto flex h-[310px] w-full max-w-[430px] items-center justify-center xl:h-[350px]" aria-hidden="true">
            <div className="portal-orbit portal-orbit-outer" />
            <div className="portal-orbit portal-orbit-inner" />
            <div className="portal-core"><Layers3 className="h-14 w-14 stroke-[1.4]" /></div>
            <div className="portal-float portal-float-one"><Globe2 className="h-5 w-5" /><span>Workspace</span></div>
            <div className="portal-float portal-float-two"><ShieldCheck className="h-5 w-5" /><span>Secure access</span></div>
            <div className="portal-float portal-float-three"><Sparkles className="h-5 w-5" /><span>Connected</span></div>
          </div>
          <div className="portal-enter relative z-10 max-w-lg">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.18em] text-white/85"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> One account, every workspace</span>
            <h1 className="text-4xl font-semibold leading-[1.12] tracking-[-.045em] xl:text-[3.25rem]">Your work, beautifully connected.</h1>
            <p className="mt-5 max-w-md text-base leading-7 text-white/65">Sign in once and move effortlessly between the applications that power your day.</p>
            <div className="mt-8 flex items-center gap-2 text-sm text-white/55"><LockKeyhole className="h-4 w-4" /> Protected access to your applications</div>
          </div>
        </section>
        <section className="portal-enter flex min-h-[680px] flex-col justify-center px-6 py-12 sm:px-12 lg:px-14 xl:px-20">
          <div className="mb-10 flex items-center gap-3 text-xs font-bold tracking-[.18em] text-primary lg:hidden"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Layers3 className="h-5 w-5" /></span> ACCESS PORTAL</div>
          <div className="mb-9">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"><Fingerprint className="h-3.5 w-3.5" /> Welcome back</span>
            <h2 className="text-[2.55rem] font-semibold leading-tight tracking-[-.05em] text-foreground sm:text-5xl">Sign in to your<br />workspace<span className="text-primary">.</span></h2>
            <p className="mt-4 text-base text-muted-foreground">Enter your details to pick up where you left off.</p>
          </div>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold">Username</Label>
              <Input id="username" type="text" autoComplete="username" placeholder="Enter your username" {...register('username')} aria-invalid={!!errors.username} className={`h-12 rounded-xl border-border bg-background/70 px-4 transition-shadow focus-visible:ring-primary/25 ${errors.username ? 'border-destructive' : ''}`} />
              {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3"><Label htmlFor="password" className="text-sm font-semibold">Password</Label><Link to="/forgot-pass" className="text-sm font-semibold text-primary transition-opacity hover:opacity-70">Forgot password?</Link></div>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" {...register('password')} aria-invalid={!!errors.password} className={`h-12 rounded-xl border-border bg-background/70 px-4 pr-12 transition-shadow focus-visible:ring-primary/25 ${errors.password ? 'border-destructive' : ''}`} />
                <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting} className="portal-action mt-2 h-12 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-[0_12px_24px_-12px_hsl(var(--primary)/.7)] hover:bg-primary/90">{isSubmitting ? 'Signing in...' : <>Sign in <ArrowRight className="ml-2 h-4 w-4" /></>}</Button>
          </form>
          <div className="my-7 flex items-center gap-4 text-xs font-medium uppercase tracking-[.14em] text-muted-foreground/70"><span className="h-px flex-1 bg-border" /> or continue with <span className="h-px flex-1 bg-border" /></div>
          <Button type="button" variant="outline" onClick={() => googleLogin()} className="h-12 w-full rounded-xl border-border bg-background/70 font-semibold transition-colors hover:bg-muted"><svg aria-hidden="true" viewBox="0 0 24 24" className="mr-3 h-5 w-5"><path fill="#4285F4" d="M21.35 12.23c0-.68-.06-1.37-.18-2.03H12v3.85h5.24a4.49 4.49 0 0 1-1.94 2.95v2.45h3.15c1.85-1.7 2.9-4.2 2.9-7.22Z"/><path fill="#34A853" d="M12 21.5a9.5 9.5 0 0 0 6.45-2.35L15.3 16.7a5.75 5.75 0 0 1-8.55-3.02H3.5v2.53A9.5 9.5 0 0 0 12 21.5Z"/><path fill="#FBBC05" d="M6.75 13.68a5.7 5.7 0 0 1 0-3.36V7.79H3.5a9.5 9.5 0 0 0 0 8.42l3.25-2.53Z"/><path fill="#EA4335" d="M12 6.25c1.39 0 2.63.48 3.6 1.42l2.7-2.7A9.2 9.2 0 0 0 12 2.5a9.5 9.5 0 0 0-8.5 5.29l3.25 2.53A5.75 5.75 0 0 1 12 6.25Z"/></svg> Continue with Google</Button>
          <p className="mt-8 text-center text-sm text-muted-foreground">New to Access Portal? <Link to="/register" className="font-semibold text-primary hover:underline">Create an account</Link></p>
        </section>
      </div>
    </main>
  )
}
