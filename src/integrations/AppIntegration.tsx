import { FC, ReactNode, useMemo } from 'react'
import { AppIntegrationProps } from './AppIntegrationType'
import { ToastContainer } from 'react-toastify'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GlobalLoadingIndicator } from '@/components/common/global-loading-indicator'
import { ENV } from '@/config/env'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StandardizedApiError } from '@/types/common.ts'

const metaErrorConfig = { error: { showGlobalError: true, excludedCodes: [] } }


const AppIntegration: FC<AppIntegrationProps> = ({
  children,
}: AppIntegrationProps): ReactNode => {
  const mutationCache = new MutationCache({
    onError: (err, variables, context, mutation) => {
      const error = err as unknown as StandardizedApiError
      console.error('Mutation Error Global Handler:', { error, variables, context, mutation })
    },
  })

  const queryCache = new QueryCache({
    onError: (err, query) => {
      const error = err as unknown as StandardizedApiError
      console.error('Query Error Global Handler:', { error, query })
    },
  })

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false, meta: metaErrorConfig },
        },
        mutationCache,
        queryCache,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  return (
    <GoogleOAuthProvider clientId={ENV.GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <GlobalLoadingIndicator />
      <ToastContainer autoClose={3000} />
    </GoogleOAuthProvider>
  )
}

export default AppIntegration
