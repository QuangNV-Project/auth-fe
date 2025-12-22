import { AuthMutationResponse } from '@/api/actions/auth/auth.types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthValuesType = AuthMutationResponse & {
  isAuthenticated: boolean
}

interface AuthState {
  authValues: AuthValuesType
  setAuthData: (authValues: AuthValuesType) => void
  setAccessToken: (token: string) => void
  clearTokens: () => void
  updateAuthField: <K extends keyof AuthValuesType>(
    key: K,
    value: AuthValuesType[K]
  ) => void
  getRole: () => string | null
}

export const authStore = create<AuthState>()(
  persist(
    (set, get) => ({
      authValues: {
        isAuthenticated: false,
        accessToken: '',
        refreshToken: '',
        tokenType: '',
        expiresIn: 0,
        user: undefined

      },
      setAuthData: authValues => set({ authValues }),
      setAccessToken: token =>
        set(state => ({
          authValues: { ...state.authValues, accessToken: token },
        })),
      clearTokens: () =>
        set({
          authValues: {
            isAuthenticated: false,
            accessToken: '',
            refreshToken: '',
            tokenType: '',
            expiresIn: 0,
            user: undefined
          },
        }),

      updateAuthField: (key, value) =>
        set(state => ({
          authValues: {
            ...state.authValues,
            [key]: value,
          },
        })),
      getRole: (): string | null => get().authValues.user?.role || null,
    }),
    {
      name: 'auth-storage',
    }
  )
)
