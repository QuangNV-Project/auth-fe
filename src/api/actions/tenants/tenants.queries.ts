import { TenantService } from "@/api/service/tenant.service";
import { useQuery } from "@tanstack/react-query";


export const tenantsKeys = {
    all: ['tenants'] as const,
    lists: () => [...tenantsKeys.all, 'list'] as const,
   }

export const useTenants = () => {
    return useQuery({
        queryKey: tenantsKeys.lists(),
        queryFn: () => TenantService.getAll(),
        staleTime: 5 * 60 * 1000,
        enabled: true,
    });
};
