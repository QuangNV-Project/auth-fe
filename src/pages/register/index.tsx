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
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'react-toastify'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterFormData } from '@/schema/loginSchema'
import { useRegisterMutation } from '@/api/actions/auth/auth.mutations'
import { useCallback } from 'react'
import { ErrorHandler } from '@/utils/errorHandler'
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'

export const RegisterPage = () => {
    const navigate = useNavigate()

    // Setup form with Zod validation
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
    })

    const { mutateAsync: registerMutation } = useRegisterMutation()

    const handleRegister = useCallback(
        async (data: RegisterFormData) => {
            try {
                const result = await registerMutation({
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    firstName: data.firstName,
                    lastName: data.lastName,
                })

                toast.success(result.message || 'Registration successful!')

                // Navigate to login page after successful registration
                navigate({ to: '/login' })
            } catch (error: any) {
                ErrorHandler.showError(
                    error,
                    'Registration failed. Please try again.',
                )
            }
        },
        [registerMutation, navigate],
    )

    return (
        <div className="app-canvas flex items-center justify-center p-5 sm:p-8">
            <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 shadow-2xl shadow-primary/10 backdrop-blur-xl lg:grid-cols-[.9fr_1.1fr]">
                <section className="hidden min-h-[690px] flex-col justify-between bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-600 p-10 text-white lg:flex">
                    <div className="flex items-center gap-3 font-semibold tracking-wide"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15"><ShieldCheck className="h-5 w-5" /></span>ACCESS PORTAL</div>
                    <div className="space-y-5"><span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm"><Sparkles className="h-4 w-4" /> Start in seconds</span><h1 className="text-5xl font-semibold leading-tight">Set up your account and get going.</h1><p className="max-w-sm text-base leading-7 text-white/75">One identity gives you a secure, seamless path to every authorized application.</p></div>
                    <p className="text-sm text-white/60">Your workspace starts here.</p>
                </section>
            <Card className="w-full rounded-none border-0 bg-transparent shadow-none">
                <CardHeader className="space-y-3 px-7 pt-10 sm:px-12 sm:pt-12">
                    <span className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[.16em] text-primary lg:hidden"><ShieldCheck className="h-3.5 w-3.5" /> Access portal</span>
                    <CardTitle className="text-3xl font-semibold tracking-tight">Create your account</CardTitle>
                    <CardDescription className="text-base">Join us and start your journey. It&apos;s quick and easy.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(handleRegister)}>
                    <CardContent className="grid grid-cols-1 gap-5 px-7 sm:grid-cols-2 sm:px-12">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                placeholder="John"
                                {...register('firstName')}
                                className={`h-11 bg-background/70 ${errors.firstName ? 'border-destructive' : ''}`}
                            />
                            {errors.firstName && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                placeholder="Doe"
                                {...register('lastName')}
                                className={`h-11 bg-background/70 ${errors.lastName ? 'border-destructive' : ''}`}
                            />
                            {errors.lastName && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="johndoe"
                                {...register('username')}
                                className={`h-11 bg-background/70 ${errors.username ? 'border-destructive' : ''}`}
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                {...register('email')}
                                className={`h-11 bg-background/70 ${errors.email ? 'border-destructive' : ''}`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
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
                    </CardContent>
                    <CardFooter className="flex flex-col gap-5 px-7 pb-10 sm:px-12 sm:pb-12">
                        <Button
                            type="submit"
                            className="h-11 w-full rounded-xl bg-primary font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating Account...' : <>Sign Up <ArrowRight className="h-4 w-4" /></>}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-semibold text-primary hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
            </div>
        </div>
    )
}
