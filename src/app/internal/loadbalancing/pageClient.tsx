'use client'

import { useEffect, useMemo, useState } from 'react'
import { Globe, RefreshCcw, ShieldCheck, TriangleAlert } from 'lucide-react'

type Site = {
    id: number
    name: string
    ip: string
    primary: boolean
    operational: boolean
    maintenance: boolean
    note: string | null
    updated_at: string
}

function formatRelativeTime(timestamp: string) {
    const diffMs = Date.now() - new Date(timestamp).getTime()
    const seconds = Math.max(0, Math.floor(diffMs / 1000))
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
}

export default function LoadBalancingClient({ initialSites }: { initialSites: Site[] }) {
    const [sites, setSites] = useState(initialSites)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [switchingId, setSwitchingId] = useState<number | null>(null)

    const summary = useMemo(() => {
        const primary = sites.find(site => site.primary) || null
        const operational = sites.filter(site => site.operational && !site.maintenance).length
        return { primary, operational }
    }, [sites])

    async function refresh() {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('/api/loadbalancing/sites', { cache: 'no-store' })
            const payload = await response.json()
            if (!response.ok) {
                throw new Error(payload.error || 'Failed to load sites')
            }
            setSites(payload)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load sites')
        } finally {
            setLoading(false)
        }
    }

    async function switchPrimary(id: number) {
        setSwitchingId(id)
        setError(null)
        try {
            const response = await fetch(`/api/loadbalancing/primary/${id}`, {
                method: 'POST'
            })
            const payload = await response.json()
            if (!response.ok) {
                throw new Error(payload.error || 'Failed to switch primary site')
            }
            await refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to switch primary site')
        } finally {
            setSwitchingId(null)
        }
    }

    useEffect(() => {
        const timer = setInterval(() => {
            void refresh()
        }, 5000)

        return () => clearInterval(timer)
    }, [])

    return (
        <div className='flex h-full flex-col gap-4 overflow-hidden'>
            <div className='grid gap-4 md:grid-cols-3'>
                <div className='rounded-2xl border border-white/10 bg-login-50/5 p-4'>
                    <div className='flex items-center gap-2 text-login-200'>
                        <ShieldCheck className='h-4 w-4 text-emerald-400' />
                        Primary site
                    </div>
                    <div className='mt-3 text-xl font-semibold text-login-50'>{summary.primary?.name || 'Unset'}</div>
                    <div className='mt-1 text-xs text-login-200'>{summary.primary?.ip || 'No primary target configured'}</div>
                </div>
                <div className='rounded-2xl border border-white/10 bg-login-50/5 p-4'>
                    <div className='flex items-center gap-2 text-login-200'>
                        <Globe className='h-4 w-4 text-login' />
                        Healthy targets
                    </div>
                    <div className='mt-3 text-3xl font-semibold text-login-50'>{summary.operational}</div>
                    <div className='mt-1 text-xs text-login-200'>Operational and not in maintenance</div>
                </div>
                <div className='rounded-2xl border border-white/10 bg-login-50/5 p-4'>
                    <div className='flex items-center gap-2 text-login-200'>
                        <TriangleAlert className='h-4 w-4 text-amber-400' />
                        Failover mode
                    </div>
                    <div className='mt-3 text-xl font-semibold text-login-50'>
                        {summary.operational > 1 ? 'Redundant' : 'At risk'}
                    </div>
                    <div className='mt-1 text-xs text-login-200'>Use switch-primary to move traffic cleanly</div>
                </div>
            </div>

            <div className='flex items-center justify-between rounded-2xl border border-white/5 bg-login-50/5 p-4'>
                <p className='text-sm text-muted-foreground'>
                    Automatic polling keeps the overview fresh while the backend owns the actual failover state.
                </p>
                <button
                    type='button'
                    onClick={() => void refresh()}
                    className='inline-flex cursor-pointer items-center gap-2 rounded-xl bg-login px-3 py-2 text-sm font-medium text-black'
                >
                    <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className='rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200'>
                    {error}
                </div>
            )}

            <div className='grid gap-4'>
                {sites.map(site => (
                    <section key={site.id} className='rounded-2xl border border-white/10 bg-login-900/55 p-4'>
                        <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                            <div>
                                <div className='flex flex-wrap items-center gap-2'>
                                    <h2 className='text-base font-semibold text-login-50'>{site.name}</h2>
                                    {site.primary && <span className={`
                                        rounded-full border border-emerald-500/30
                                        bg-emerald-500/10 px-2 py-1 text-[11px]
                                        font-semibold text-emerald-300
                                    `}>
                                        Primary
                                    </span>}
                                    {site.operational
                                        ? <span className={`
                                            rounded-full border border-emerald-500/30
                                            bg-emerald-500/10 px-2 py-1 text-[11px]
                                            font-semibold text-emerald-300
                                        `}>Operational</span>
                                        : <span className={`
                                            rounded-full border border-red-500/30
                                            bg-red-500/10 px-2 py-1 text-[11px]
                                            font-semibold text-red-300
                                        `}>Down</span>}
                                    {site.maintenance && <span className={`
                                        rounded-full border border-amber-500/30
                                        bg-amber-500/10 px-2 py-1 text-[11px]
                                        font-semibold text-amber-300
                                    `}>Maintenance</span>}
                                </div>
                                <p className='mt-2 text-sm text-login-100'>{site.ip}</p>
                                <p className='mt-1 text-xs text-login-200'>Updated {formatRelativeTime(site.updated_at)}</p>
                                {site.note && <p className='mt-3 text-sm text-login-100'>{site.note}</p>}
                            </div>
                            <div className='flex items-center gap-3'>
                                <button
                                    type='button'
                                    disabled={site.primary || switchingId === site.id}
                                    onClick={() => void switchPrimary(site.id)}
                                    className={`
                                        inline-flex cursor-pointer items-center
                                        gap-2 rounded-xl border border-white/10
                                        px-3 py-2 text-sm font-medium text-login-50
                                        disabled:cursor-not-allowed disabled:opacity-50
                                    `}
                                >
                                    {switchingId === site.id ? 'Switching...' : site.primary ? 'Serving traffic' : 'Make primary'}
                                </button>
                            </div>
                        </div>
                    </section>
                ))}
            </div>
        </div>
    )
}
