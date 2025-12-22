import { FC, useCallback, useEffect, useState } from "react"
import { useSearch, useNavigate } from '@tanstack/react-router';
import { useAuthMutation } from "@/api/actions/auth/auth.mutations";
import { authStore } from "@/stores/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

type CallbackStatus = 'loading' | 'success' | 'error';

const CallbackPage: FC = () => {
    const { setAuthData } = authStore()
    const { code } = useSearch({
        strict: false,
    });
    const navigate = useNavigate();
    const [status, setStatus] = useState<CallbackStatus>('loading');
    const [error, setError] = useState<string>('');

    const authMutation = useAuthMutation();

    const handleNavigateAuth = useCallback(() => {
        navigate({ to: '/login' });
    }, [navigate]);

    useEffect(() => {
        if (code) {
            setStatus('loading');
            authMutation.mutateAsync(
                { code },
                {
                    onSuccess: (data) => {
                        setStatus('success');
                        setAuthData({
                            isAuthenticated: true,
                            ...data,
                        });
                        navigate({ to: "/list-web" });
                    },
                    onError: (error: any) => {
                        setStatus('error');
                        setError(error?.message || 'Authentication failed. Please try again.');
                    }
                }
            );
        } else {
            setStatus('error');
            setError('No authorization code received. Please try logging in again.');
        }
    }, []);

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <>
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <Shield className="w-8 h-8 text-blue-600" />
                            </div>
                            <CardTitle className="text-xl font-semibold text-gray-800">
                                Authenticating...
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center pb-8">
                            <div className="flex justify-center mb-4">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            </div>
                            <p className="text-gray-600 text-sm">
                                Please wait while we verify your credentials and set up your session.
                            </p>
                        </CardContent>
                    </>
                );

            case 'success':
                return (
                    <>
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <CardTitle className="text-xl font-semibold text-gray-800">
                                Authentication Successful!
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center pb-8">
                            <p className="text-gray-600 text-sm mb-2">
                                Welcome back! You have been successfully authenticated.
                            </p>
                            <p className="text-gray-500 text-xs">
                                Redirecting you to the dashboard...
                            </p>
                        </CardContent>
                    </>
                );

            case 'error':
                return (
                    <>
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <CardTitle className="text-xl font-semibold text-gray-800">
                                Authentication Failed
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center pb-8">
                            <p className="text-red-600 text-sm mb-4">
                                {error}
                            </p>
                            <Button
                                onClick={handleNavigateAuth}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                Back to Login
                            </Button>
                        </CardContent>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                {renderContent()}
            </Card>
        </div>
    )
}

export default CallbackPage;