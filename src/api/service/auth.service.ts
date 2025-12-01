import { API_METHOD } from "@/constant/common"
import {
    LoginMutationArguments,
    LoginMutationResponse,
    RegisterMutationArguments,
    RegisterMutationResponse
} from "../actions/auth/auth.types"
import { apiRequest } from '@/api/axios'

const AUTH_API_BASE_URL = '/auth/public'

interface AuthServiceType {
    handleLogin: (data: LoginMutationArguments) => Promise<LoginMutationResponse>
    handleRegister: (data: RegisterMutationArguments) => Promise<RegisterMutationResponse>
}

export const AuthService: AuthServiceType = {
    handleLogin: async function (data: LoginMutationArguments): Promise<LoginMutationResponse> {
        const res = await apiRequest<LoginMutationResponse>({
            method: API_METHOD.POST,
            url: `${AUTH_API_BASE_URL}/auth/login`,
            data,
        })
        return res
    },

    handleRegister: async function (data: RegisterMutationArguments): Promise<RegisterMutationResponse> {
        const res = await apiRequest<RegisterMutationResponse>({
            method: API_METHOD.POST,
            url: `${AUTH_API_BASE_URL}/auth/register`,
            data,
        })

        return res
    },
}