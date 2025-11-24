import { FC, ReactNode } from 'react'
import { AppProvidersProps } from './AppProviders.type'
import AppIntegration from '@/integrations/AppIntegration'

const AppProviders: FC<AppProvidersProps> = ({
  children,
}: AppProvidersProps): ReactNode => {
  return (
    <AppIntegration>{children}
    </AppIntegration>
  )
}

export default AppProviders
