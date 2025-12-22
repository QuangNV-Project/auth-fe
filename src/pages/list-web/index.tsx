import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Globe, LogOut } from 'lucide-react'
import { useTenants } from '@/api/actions/tenants/tenants.queries'
import { ReactNode, useMemo } from 'react'
import { authStore } from '@/stores/authStore'
import { useRouter } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'


export const ListWebPage = () => {
    const { data: tenants } = useTenants()
    const router = useRouter()
    const { authValues, clearTokens } = authStore()
    const user = authValues.user

    const groupedByProject = useMemo(() => {
        if (!tenants || tenants.length === 0) return [] as Array<{
            projectId: string
            projectName: string
            projectColor: string
            projectIcon: ReactNode | null
            items: any[]
        }>

        const map = new Map<string, any[]>()
        tenants.forEach((t: any) => {
            const key = String(t?.projectId ?? t?.project?.id ?? 'unknown')
            const arr = map.get(key) ?? []
            arr.push(t)
            map.set(key, arr)
        })

        return Array.from(map.entries()).map(([projectId, items]) => {
            const first: any = items[0]
            return {
                projectId,
                projectName: first?.project?.name ?? first?.projectName ?? `Project ${projectId}`,
                projectColor: first?.project?.color ?? first?.color ?? 'from-gray-400 to-gray-600',
                projectIcon: first?.project?.icon ?? first?.icon ?? null,
                items,
            }
        })
    }, [tenants])

    const handleNavigate = (url: string) => {
        window.location.href = url
    }

    const handleLogout = async () => {
        clearTokens()
        await router.navigate({ to: '/' })
    }

    const getUserInitials = () => {
        if (!user) return 'U'
        const first = user.firstName?.charAt(0) || ''
        const last = user.lastName?.charAt(0) || ''
        return (first + last).toUpperCase() || user.username?.charAt(0).toUpperCase() || 'U'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Top Navigation Bar with User Info */}
                <div className="flex items-center justify-between mb-12">
                    <div></div>
                    {user && (
                        <div className="flex items-center gap-4 bg-white px-4 py-3 rounded-lg shadow-md">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">
                                    {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            <Avatar className="h-10 w-10">
                                {user.avatar && <AvatarImage src={user.avatar} alt={user.username} />}
                                <AvatarFallback className="bg-orange-500 text-white font-semibold">
                                    {getUserInitials()}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <LogOut className="h-4 w-4 mr-1" />
                                Đăng xuất
                            </Button>
                        </div>
                    )}
                </div>

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-white rounded-full shadow-lg">
                            <Globe className="h-16 w-16 text-orange-500" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Chào mừng bạn đến với hệ thống
                    </h1>
                    <p className="text-xl text-gray-600">
                        Chọn ứng dụng bạn muốn truy cập
                    </p>
                </div>

                {/* Grouped by Project */}
                {groupedByProject.length === 0 ? (
                    <div className="text-center text-gray-500">Không có ứng dụng nào</div>
                ) : (
                    groupedByProject.map((group) => (
                        <div key={group.projectId} className="mb-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${group.projectColor} flex items-center justify-center text-white`}>
                                        {group.projectIcon ?? <Globe className="h-6 w-6" />}
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-800">{group.projectName}</h2>
                                </div>
                                <span className="text-sm text-gray-500">{group.items.length} ứng dụng</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {group.items.map((tenant: any) => (
                                    <Card
                                        key={tenant.id}
                                        className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                                        onClick={() => handleNavigate(tenant.url)}
                                    >
                                        <CardHeader>
                                            <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${tenant.color ?? group.projectColor} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                                {tenant.icon ?? group.projectIcon ?? <Globe className="h-6 w-6" />}
                                            </div>
                                            <CardTitle className="text-2xl mb-2 flex items-center justify-between">
                                                {tenant.name}
                                                <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                                            </CardTitle>
                                            <CardDescription className="text-base">
                                                {tenant.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Button
                                                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleNavigate(tenant.url)
                                                }}
                                            >
                                                Truy cập
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))
                )}

                {/* Footer */}
                <div className="mt-16 text-center text-gray-500 text-sm">
                    <p>© 2025 All rights reserved</p>
                </div>
            </div>
        </div>
    )
}
