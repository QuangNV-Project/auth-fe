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
    const { code, type } = useSearch({
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
                { code, type },
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
                            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
                                <Shield className="w-8 h-8" />
                            </div>
                            <CardTitle className="text-xl font-semibold">
                                Authenticating...
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center pb-8">
                            <div className="flex justify-center mb-4">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                            <p className="text-muted-foreground text-sm leading-6">
                                Please wait while we verify your credentials and set up your session.
                            </p>
                        </CardContent>
                    </>
                );

            case 'success':
                return (
                    <>
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <CardTitle className="text-xl font-semibold">
                                Authentication Successful!
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center pb-8">
                            <p className="text-muted-foreground text-sm mb-2">
                                Welcome back! You have been successfully authenticated.
                            </p>
                            <p className="text-muted-foreground text-xs">
                                Redirecting you to the dashboard...
                            </p>
                        </CardContent>
                    </>
                );

            case 'error':
                return (
                    <>
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                                <XCircle className="w-8 h-8" />
                            </div>
                            <CardTitle className="text-xl font-semibold">
                                Authentication Failed
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center pb-8">
                            <p className="text-destructive text-sm mb-4">
                                {error}
                            </p>
                            <Button
                                onClick={handleNavigateAuth}
                                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
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
        <div className="app-canvas flex items-center justify-center p-5">
            <Card className="w-full max-w-md mx-auto rounded-3xl border-border/70 bg-card/80 shadow-2xl shadow-primary/10 backdrop-blur-xl">
                {renderContent()}
            </Card>
        </div>
    )
}

export default CallbackPage;
