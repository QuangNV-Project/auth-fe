import { API_METHOD } from "@/constant/common"
import { apiRequest } from '@/api/axios'
import { TenantRes } from "@/types/tenants"

const TENANT_API_BASE_URL = '/tenant/private'

interface TenantServiceType {
    getAll: () => Promise<Array<TenantRes>>
}

export const TenantService: TenantServiceType = {
    getAll: async function (): Promise<Array<TenantRes>> {
        const res = await apiRequest<Array<TenantRes>>({
            method: API_METHOD.GET,
            url: `${TENANT_API_BASE_URL}/tenant/get-by-user`,
        })
        return res
    }
}