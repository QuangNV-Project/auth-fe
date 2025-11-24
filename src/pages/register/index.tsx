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

    const handleRegister = useCallback(async (data: RegisterFormData) => {
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
            ErrorHandler.showError(error, 'Registration failed. Please try again.')
        }
    }, [registerMutation, navigate])

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left side - Register form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-4 sm:p-8">
                <Card className="w-full max-w-[450px]">
                    <CardHeader className="text-center pb-6">
                        <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
                        <CardDescription className="text-lg">
                            Sign up to get started
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit(handleRegister)}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Enter username (3-20 characters)"
                                    {...register('username')}
                                    className={errors.username ? 'border-red-500' : ''}
                                />
                                {errors.username && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    {...register('email')}
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="Enter your first name"
                                    {...register('firstName')}
                                    className={errors.firstName ? 'border-red-500' : ''}
                                />
                                {errors.firstName && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="Enter your last name"
                                    {...register('lastName')}
                                    className={errors.lastName ? 'border-red-500' : ''}
                                />
                                {errors.lastName && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter password (min 6 characters)"
                                    {...register('password')}
                                    className={errors.password ? 'border-red-500' : ''}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                            </Button>

                            <div className="text-sm text-center">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="text-orange-500 hover:underline font-medium"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>

            {/* Right side - Background image */}
            <div
                className="hidden lg:block lg:w-1/2 bg-cover bg-center relative"
                style={{ backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYlqSHWh4SkbN7fYvwk0TBLlnbFvbLfr3xwpbFSVZw4gDZ2_FwZ5EW-cXz9uIHjXLZ-noFHceZDJq5PLTqdcV8ifdQXCWd_kVj7BBXT2dIsA&s=10')" }}
            >
                <div className="h-full w-full bg-black/40 flex items-center justify-center">
                    <div className="text-white text-center p-8">
                        <h1 className="text-4xl font-bold mb-4">Join Us Today!</h1>
                        <p className="text-lg">
                            Create your account and start managing your facilities
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}