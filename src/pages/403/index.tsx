import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, Shield, ArrowLeft, Lock } from 'lucide-react'
import { Link, useNavigate, useRouter } from '@tanstack/react-router'

export const ForbiddenPage = () => {
  const router = useRouter()
  const navigate = useNavigate()

  return (
    <div className="app-canvas flex min-h-screen items-center justify-center p-5">
      <Card className="w-full max-w-2xl rounded-3xl border-border/70 bg-card/80 shadow-2xl shadow-primary/10 backdrop-blur-xl">
        <CardContent className="p-8 text-center sm:p-12">
          {/* Error Icon */}
          <div className="mb-6">
            <div className="relative inline-block">
              <Shield className="w-24 h-24 text-primary mx-auto" />
              <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
                403
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Access denied
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              You do not have permission to access this page.
            </p>
            <p className="text-sm text-muted-foreground">
              Please contact the administrator if you believe this is an error.
            </p>
          </div>

          {/* Warning Box */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-destructive">
              <Lock className="w-5 h-5" />
              <span className="font-medium text-sm">
                Protected resource - Special access required
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-2 rounded-xl shadow-lg shadow-primary/25"
            >
              <Home className="w-4 h-4" />
              Go to home
            </Button>

            <Button
              variant="outline"
              onClick={() => router.history.back()}
              className="flex items-center gap-2 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back
            </Button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">Need help?</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                to="/home"
                className="text-primary hover:underline flex items-center gap-1"
              >
                <Home className="w-3 h-3" />
                Home
              </Link>
              <span className="text-primary hover:underline cursor-pointer flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Contact support
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
