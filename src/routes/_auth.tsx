import { createFileRoute, redirect } from '@tanstack/react-router'
import Layout from '../layout'
import { authStore } from '@/stores/authStore'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    // logic to authen route
    const { authValues } = authStore.getState()
    if (!authValues.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirectTo: location.pathname + location.search,
        },
      })
    }
  },
  loader: async () => {
    return null
  },
  component: Layout,
})
