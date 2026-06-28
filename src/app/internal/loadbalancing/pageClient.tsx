'use client'

import { useEffect, useMemo, useState } from 'react'
import { Globe, RefreshCcw, ShieldCheck, TriangleAlert } from 'lucide-react'
import { Button, Card, StatCard } from 'uibee/components'

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
                <StatCard icon={ShieldCheck} tone='emerald' label='Primary site' value={summary.primary?.name || 'Unset'} />
                <StatCard icon={Globe} tone='blue' label='Healthy targets' value={String(summary.operational)} />
                <StatCard icon={TriangleAlert} tone='amber' label='Failover mode' value={summary.operational > 1 ? 'Redundant' : 'At risk'} />
            </div>

            <Card className='flex items-center justify-between p-4'>
                <p className='text-sm text-muted-foreground'>
                    Automatic polling keeps the overview fresh while the backend owns the actual failover state.
                </p>
                <Button
                    text='Refresh'
                    icon={<RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />}
                    onClick={() => void refresh()}
                />
            </Card>

            {error && (
                <div className='rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200'>
                    {error}
                </div>
            )}

            <div className='grid gap-4'>
                {sites.map(site => (
                    <Card key={site.id} className='p-4'>
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
                                <Button
                                    type='button'
                                    variant='secondary'
                                    disabled={site.primary || switchingId === site.id}
                                    onClick={() => void switchPrimary(site.id)}
                                    text={switchingId === site.id ? 'Switching...' : site.primary ? 'Serving traffic' : 'Make primary'}
                                />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
