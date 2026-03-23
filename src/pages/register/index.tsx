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
        <div
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-4"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            }}
        >
            <Card className="w-full max-w-md bg-black/50 text-white backdrop-blur-lg border border-gray-500">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl font-bold">Create an Account</CardTitle>
                    <CardDescription className="text-gray-200">
                        Join us and start your journey. It's quick and easy!
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(handleRegister)}>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                placeholder="John"
                                {...register('firstName')}
                                className={`bg-black/20 border-gray-500 placeholder:text-gray-400 focus:ring-orange-500 ${errors.firstName ? 'border-red-500' : ''}`}
                            />
                            {errors.firstName && (
                                <p className="text-sm text-red-400 mt-1">
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
                                className={`bg-black/20 border-gray-500 placeholder:text-gray-400 focus:ring-orange-500 ${errors.lastName ? 'border-red-500' : ''}`}
                            />
                            {errors.lastName && (
                                <p className="text-sm text-red-400 mt-1">
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
                                className={`bg-black/20 border-gray-500 placeholder:text-gray-400 focus:ring-orange-500 ${errors.username ? 'border-red-500' : ''}`}
                            />
                            {errors.username && (
                                <p className="text-sm text-red-400 mt-1">
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
                                className={`bg-black/20 border-gray-500 placeholder:text-gray-400 focus:ring-orange-500 ${errors.email ? 'border-red-500' : ''}`}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-400 mt-1">
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
                                className={`bg-black/20 border-gray-500 placeholder:text-gray-400 focus:ring-orange-500 ${errors.password ? 'border-red-500' : ''}`}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-400 mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                        <p className="text-center text-sm text-gray-200">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-semibold text-orange-400 hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}