import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Globe, LogOut, Orbit, Sparkles } from 'lucide-react'
import { useTenants } from '@/api/actions/tenants/tenants.queries'
import { useMemo } from 'react'
import { authStore } from '@/stores/authStore'
import { useRouter } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TenantRes } from '@/types/tenants'

export const ListWebPage = () => {
  const { data: tenants } = useTenants()
  const router = useRouter()
  const { authValues, clearTokens } = authStore()
  const user = authValues.user
  const groupedByProject = useMemo(() => {
    if (!tenants?.length) return [] as Array<{ projectId: number; projectName: string; items: TenantRes[] }>
    const map = new Map<number, TenantRes[]>()
    tenants.forEach((tenant: TenantRes) => map.set(tenant.projectId, [...(map.get(tenant.projectId) ?? []), tenant]))
    return Array.from(map.entries()).map(([projectId, items]) => ({ projectId, projectName: items[0].projectName, items }))
  }, [tenants])
  const handleNavigate = (url: string) => { window.location.href = url }
  const handleLogout = async () => { clearTokens(); await router.navigate({ to: '/' }) }
  const getUserInitials = () => {
    if (!user) return 'U'
    const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase()
    return initials || user.username?.charAt(0).toUpperCase() || 'U'
  }

  return <div className="app-canvas py-6 sm:py-8"><div className="mx-auto max-w-7xl px-5 sm:px-8">
    <header className="mb-14 flex items-center justify-between gap-5"><div className="flex items-center gap-3 font-semibold tracking-wide text-foreground"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary to-violet-400 text-primary-foreground shadow-lg shadow-primary/25"><Orbit className="h-6 w-6" /></span><span>ACCESS PORTAL</span></div>
      {user && <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/75 px-3 py-2 shadow-sm backdrop-blur"><div className="hidden text-right sm:block"><p className="text-sm font-semibold text-foreground">{user.firstName} {user.lastName}</p><p className="text-xs text-muted-foreground">{user.email}</p></div><Avatar className="h-10 w-10">{user.avatar && <AvatarImage src={user.avatar} alt={user.username} />}<AvatarFallback className="bg-primary font-semibold text-primary-foreground">{getUserInitials()}</AvatarFallback></Avatar><Button variant="ghost" size="sm" onClick={handleLogout} className="ml-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><LogOut className="mr-1 h-4 w-4" /><span className="hidden sm:inline">Đăng xuất</span></Button></div>}
    </header>
    <div className="mx-auto mb-14 max-w-2xl text-center"><div className="mb-6 flex justify-center"><div className="grid h-16 w-16 place-items-center rounded-3xl border border-primary/15 bg-primary/10 text-primary shadow-sm"><Sparkles className="h-8 w-8" /></div></div><span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[.16em] text-primary">Your workspace</span><h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Chào mừng bạn trở lại</h1><p className="mt-4 text-lg leading-7 text-muted-foreground">Chọn ứng dụng bạn muốn truy cập</p></div>
    {groupedByProject.length === 0 ? <div className="rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center text-muted-foreground">Không có ứng dụng nào để hiển thị.</div> : groupedByProject.map((group) => <section key={group.projectId} className="mb-12"><div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-violet-400 text-primary-foreground shadow-md shadow-primary/20"><Globe className="h-6 w-6" /></div><h2 className="text-2xl font-semibold text-foreground">{group.projectName}</h2></div><span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">{group.items.length} ứng dụng</span></div><div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{group.items.map((tenant) => <Card key={tenant.tenantId} className="group cursor-pointer rounded-3xl border-border/70 bg-card/75 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/10" onClick={() => handleNavigate(tenant.siteUrl)}><CardHeader><div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110"><Globe className="h-7 w-7" /></div><CardTitle className="mb-3 flex items-center justify-between text-xl">{tenant.siteTitle}<ExternalLink className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" /></CardTitle><CardDescription><div className="flex items-center gap-2"><Globe className="h-4 w-4" /><span className="font-mono text-sm">{tenant.domainName}</span></div></CardDescription></CardHeader><CardContent><Button className="h-11 w-full rounded-xl bg-primary font-semibold shadow-md shadow-primary/20 hover:bg-primary/90" onClick={(event) => { event.stopPropagation(); handleNavigate(tenant.siteUrl) }}>Truy cập <ExternalLink className="h-4 w-4" /></Button></CardContent></Card>)}</div></section>)}
    <footer className="mt-16 border-t border-border/70 pt-7 text-center text-sm text-muted-foreground">© 2025 All rights reserved</footer>
  </div></div>
}
