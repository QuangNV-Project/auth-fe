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

export const LoginPage = () => {

  const navigate = useNavigate()
  const { redirectTo, state } = useSearch({
    strict: false,
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  const { mutateAsync: credentialLoginMutation } = useLoginMutation()

  const handleLogin = useCallback(async (data: LoginFormData) => {
    await credentialLoginMutation({
      userName: data.username,
      password: data.password,
      redirectTo,
      state
    }, {
      onSuccess: (res: LoginMutationResponse) => {
        // Nếu có redirectTo thì chuyển về callback URL
        if (res.redirectTo) {
          window.location.href = res.redirectTo + "/callback?code=" + res.code + "&state=" + res.state + "&type=ACCOUNT";
        } else {
          // Nếu không có redirectTo thì chuyển đến trang list-web
          navigate({ to: '/callback', search: { code: res.code, type: 'ACCOUNT' } });
        }
        toast.success('Login successful')
      }
    })
  }, [credentialLoginMutation])

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse ) => {
      if (redirectTo) {
        window.location.href =
          `${redirectTo}/callback?code=${codeResponse.code}&state=${state}&type=GOOGLE`;
      } else {
        navigate({ to: '/callback', search: { code: codeResponse.code, type: 'GOOGLE' } });
      }

      toast.success('Login successful');

    },
    onError: () => {
      toast.error('Google login failed');
    },
  });

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-4 sm:p-8">
        <Card className="w-full max-w-[400px]">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-lg">
              Sign in to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(handleLogin)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
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
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-50 px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="w-full flex justify-center">
                <Button type="button" onClick={() => googleLogin()}>Login with Google</Button>
              </div>
              <div className="text-sm text-center space-y-2">
                <Link
                  to="/forgot-pass"
                  className="text-orange-500 hover:underline block"
                >
                  Forgot password?
                </Link>
                <div>
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-orange-500 hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Right side - Background image */}
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYlqSHWh4SkbN7fYvwk0TBLlnbFvbLfr3xwpbFSVZw4gDZ2_FwZ5EW-cXz9uIHjXLZ-noFHceZDJq5PLTqdcV8ifdQXCWd_kVj7BBXT2dIsA&s=10" }}
      >
        <div className="h-full w-full bg-black/40 flex items-center justify-center">
          <div className="text-white text-center p-8">
            <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-lg">
              Sign in to access your account and manage your facilities
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
