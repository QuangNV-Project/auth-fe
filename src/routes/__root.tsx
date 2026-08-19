import { NotFoundPage } from '@/pages'
import AppProviders from '@/providers/AppProviders'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRoute, Outlet, ErrorComponent } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ThemeToggle } from '@/components/common/theme-toggle'
const enableTanstackRouterDevtools = import.meta.env.DEV

export const Route = createRootRoute({
  component: () => (
    <AppProviders>
      <Outlet />
      <div className="fixed right-5 top-5 z-50">
        <ThemeToggle />
      </div>
      {enableTanstackRouterDevtools && <TanStackRouterDevtools />}
      <ReactQueryDevtools initialIsOpen={false} />
    </AppProviders>
  ),
  notFoundComponent: () => <NotFoundPage />,
  errorComponent: ({ error }) => {
    // Fallback other error
    return <ErrorComponent error={error} />
  },
})
