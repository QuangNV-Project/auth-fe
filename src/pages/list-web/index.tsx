import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowRight, ExternalLink, Globe2, Layers3, LayoutGrid, LogOut, Search, Sparkles } from 'lucide-react'
import { useTenants } from '@/api/actions/tenants/tenants.queries'
import { useMemo, useState } from 'react'
import { authStore } from '@/stores/authStore'
import { useRouter } from '@tanstack/react-router'
import { TenantRes } from '@/types/tenants'

export const ListWebPage = () => {
  const { data: tenants, isLoading } = useTenants()
  const router = useRouter()
  const { authValues, clearTokens } = authStore()
  const user = authValues.user
  const [search, setSearch] = useState('')
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'bạn'
  const initials = ([user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('') || user?.username?.[0] || 'U').toUpperCase()
  const query = search.trim().toLocaleLowerCase()

  const groupedByProject = useMemo(() => {
    const map = new Map<number, TenantRes[]>()
    tenants?.forEach((tenant) => {
      if (query && ![tenant.siteTitle, tenant.domainName, tenant.projectName].some((value) => value?.toLocaleLowerCase().includes(query))) return
      map.set(tenant.projectId, [...(map.get(tenant.projectId) ?? []), tenant])
    })
    return Array.from(map.entries()).map(([projectId, items]) => ({
      projectId,
      projectName: items[0].projectName,
      items,
    }))
  }, [tenants, query])

  const handleLogout = async () => {
    clearTokens()
    await router.navigate({ to: '/' })
  }

  return (
    <main className="portal-page min-h-screen">
      <div className="mx-auto max-w-[1320px] px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <header className="portal-enter flex min-h-16 items-center justify-between gap-4 pr-12 sm:pr-14">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><Layers3 className="h-5 w-5" /></span>
            <div><p className="text-sm font-extrabold tracking-[.13em] text-foreground">ACCESS PORTAL</p><p className="text-xs text-muted-foreground">Your connected workspace</p></div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {user && <div className="flex items-center gap-3 rounded-full border border-border bg-card/80 py-1.5 pl-1.5 pr-2 shadow-sm sm:pr-4">
              <Avatar className="h-9 w-9"><AvatarImage src={user.avatar} alt={displayName} /><AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">{initials}</AvatarFallback></Avatar>
              <div className="hidden max-w-40 sm:block"><p className="truncate text-sm font-semibold leading-tight text-foreground">{displayName}</p><p className="truncate text-xs text-muted-foreground">{user.email}</p></div>
            </div>}
            <Button type="button" variant="ghost" size="icon" onClick={handleLogout} aria-label="Đăng xuất" title="Đăng xuất" className="h-10 w-10 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><LogOut className="h-4 w-4" /></Button>
          </div>
        </header>

        <section className="portal-banner portal-enter relative mt-7 overflow-hidden rounded-[28px] px-6 py-9 text-white sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="portal-grid" aria-hidden="true" />
          <div className="portal-banner-art" aria-hidden="true"><span /><span /><span /><div className="portal-banner-icon"><Layers3 className="h-12 w-12 stroke-[1.3]" /></div></div>
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.16em] text-white/85"><Sparkles className="h-3.5 w-3.5" /> Your digital workspace</span>
            <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-[-.04em] sm:text-4xl lg:text-[2.8rem]">Chào mừng trở lại,<br /><span className="text-[#b9eece]">{displayName}.</span></h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-white/70 sm:text-base">Mọi ứng dụng bạn cần, trong một không gian. Chọn ứng dụng để bắt đầu công việc hôm nay.</p>
            <div className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-white/80"><span className="h-2 w-2 rounded-full bg-[#92e4b3] shadow-[0_0_0_5px_rgba(146,228,179,.12)]" /> {tenants?.length ?? 0} ứng dụng sẵn sàng</div>
          </div>
        </section>

        <section className="portal-enter mt-11">
          <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-primary"><LayoutGrid className="h-4 w-4" /> Applications</div><h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Khám phá ứng dụng</h2><p className="mt-2 text-sm text-muted-foreground">Truy cập nhanh các ứng dụng trong hệ thống của bạn.</p></div>
            <div className="relative w-full sm:w-[300px]"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Tìm ứng dụng" placeholder="Tìm ứng dụng..." className="h-11 rounded-xl border-border bg-card pl-11 shadow-sm focus-visible:ring-primary/25" /></div>
          </div>

          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Đang tải ứng dụng">{[0, 1, 2].map((item) => <div key={item} className="h-52 animate-pulse rounded-2xl border border-border bg-card/70" />)}</div>
          ) : groupedByProject.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card/70 px-6 py-16 text-center"><div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"><Search className="h-6 w-6" /></div><h3 className="text-lg font-semibold text-foreground">{query ? 'Không tìm thấy ứng dụng' : 'Chưa có ứng dụng nào'}</h3><p className="mt-2 text-sm text-muted-foreground">{query ? 'Thử tìm bằng tên ứng dụng, tên dự án hoặc tên miền khác.' : 'Các ứng dụng được cấp quyền sẽ xuất hiện tại đây.'}</p>{query && <Button type="button" variant="link" onClick={() => setSearch('')} className="mt-2 text-primary">Xóa tìm kiếm</Button>}</div>
          ) : groupedByProject.map((group) => (
            <section key={group.projectId} className="mb-11">
              <div className="mb-4 flex items-center justify-between gap-4 border-b border-border/80 pb-4"><div className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Globe2 className="h-5 w-5" /></span><div className="min-w-0"><h3 className="truncate text-lg font-semibold text-foreground">{group.projectName}</h3><p className="text-xs text-muted-foreground">Nhóm ứng dụng</p></div></div><span className="shrink-0 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">{group.items.length} ứng dụng</span></div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((tenant) => (
                  <a key={tenant.tenantId} href={tenant.siteUrl} className="portal-app-card group relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-[0_8px_24px_-18px_rgba(21,35,69,.45)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_22px_35px_-22px_rgba(46,53,112,.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <div className="relative z-10 flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110"><Globe2 className="h-6 w-6" /></span><ExternalLink className="h-4 w-4 text-muted-foreground/60 transition-colors group-hover:text-primary" /></div>
                    <div className="relative z-10 mt-7"><h4 className="truncate text-lg font-semibold text-foreground">{tenant.siteTitle}</h4><p className="mt-1 truncate text-sm text-muted-foreground">{tenant.domainName}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">Truy cập ứng dụng <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </section>
        <footer className="mt-8 border-t border-border/70 pt-6 text-center text-xs text-muted-foreground">Access Portal · Your connected workspace</footer>
      </div>
    </main>
  )
}
