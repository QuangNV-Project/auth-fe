import { API_METHOD } from "@/constant/common"
import {
    AuthMutationResponse,
    LoginMutationArguments,
    LoginMutationResponse,
    RegisterMutationArguments,
    RegisterMutationResponse
} from "../actions/auth/auth.types"
import { apiRequest } from '@/api/axios'
import { AuthExchangeCodeReq } from "@/types/auth"

const AUTH_API_BASE_URL = '/auth/public'

interface AuthServiceType {
    handleLogin: (data: LoginMutationArguments) => Promise<LoginMutationResponse>
    handleRegister: (data: RegisterMutationArguments) => Promise<RegisterMutationResponse>
    handleExchangeAuthCode: (data: AuthExchangeCodeReq) => Promise<AuthMutationResponse>
}

export const AuthService: AuthServiceType = {
    handleLogin: async function (data: LoginMutationArguments): Promise<LoginMutationResponse> {
        const res = await apiRequest<LoginMutationResponse>({
            method: API_METHOD.POST,
            url: `${AUTH_API_BASE_URL}/auth/login`,
            data,
        })
        return res.data
    },

    handleRegister: async function (data: RegisterMutationArguments): Promise<RegisterMutationResponse> {
        const res = await apiRequest<RegisterMutationResponse>({
            method: API_METHOD.POST,
            url: `${AUTH_API_BASE_URL}/auth/register`,
            data,
        })

        return res.data
    },
    handleExchangeAuthCode: async function (data: AuthExchangeCodeReq): Promise<AuthMutationResponse> {
        const res = await apiRequest<AuthMutationResponse>({
            method: API_METHOD.POST,
            url: `${AUTH_API_BASE_URL}/auth/exchange-code`,
            data,
        })

        return res.data
    },
}