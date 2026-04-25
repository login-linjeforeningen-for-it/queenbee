'use client'

import { Activity, Clock, Globe, ShieldAlert, Cpu, Monitor } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import statusClasses from './statusClasses'
import RequestsOverTimeChart from './requestsOverTimeChart'
import CombinedMetrics from './combinedMetrics'
import Bar from './bar'
import Table from '@components/table/table'
import Marquee from '@components/shared/marquee'
import DomainSelector from './domainSelector'
import { TrafficMetricsProps, TrafficRecordsProps, TrafficRecord, TrafficEntry } from '@utils/api/beekeeper/traffic/types'

type TrafficDashboardProps = {
    metrics?: TrafficMetricsProps | string
    records?: TrafficRecordsProps | string
    selectedDomain?: string
    domainOptions?: string[]
}

export default function TrafficDashboard({ metrics, records, selectedDomain, domainOptions = [] }: TrafficDashboardProps) {
    const m = typeof metrics === 'object' && metrics !== null ? (metrics as TrafficMetricsProps) : undefined

    const totalRequests = Number(m?.total_requests) || 0
    const avgRequestTime = Number.isFinite(Number(m?.avg_request_time)) ? Math.round(Number(m!.avg_request_time)) : null
    const errorRate = Number.isFinite(Number(m?.error_rate)) ? (Number(m!.error_rate) * 100).toFixed(1) : null

    const methods = (m?.top_methods ?? [])
    const statuses = (m?.top_status_codes ?? [])
    const domains = (m?.top_domains ?? [])
    const os = (m?.top_os ?? [])
    const browsers = (m?.top_browsers ?? [])
    const requestsOverTime = (m?.requests_over_time ?? [])
    const topErrorPaths = (m?.top_error_paths ?? [])
    const topSlowPaths = (m?.top_slow_paths ?? [])
    const topPaths = (m?.top_paths ?? [])

    const allMetrics = [
        { title: 'Methods', data: methods },
        { title: 'Status Codes', data: statuses },
        ...(selectedDomain
            ? [{ title: 'Requests Over Time', data: requestsOverTime, isChart: true }]
            : [{ title: 'Domains', data: domains }]
        ),
        { title: 'Top Slow Paths (ms)', data: topSlowPaths },
        { title: ['Operating Systems', 'Browsers'], data: [os, browsers] },
        { title: ['Top Paths', 'Top Error Paths'], data: [topPaths, topErrorPaths] }
    ]

    const r = typeof records === 'object' && records !== null ? (records as TrafficRecordsProps) : undefined
    const recs = (r?.result ?? []) as TrafficRecord[]

    const formatTime = (ts: string) => {
        const d = new Date(ts)
        const now = new Date()
        const isToday = d.toDateString() === now.toDateString()
        if (isToday) {
            return d.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }
        return d.toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    }

    const getDurationColor = (ms: number) => {
        if (ms < 200) return 'text-emerald-400'
        if (ms < 800) return 'text-amber-400'
        return 'text-rose-400'
    }

    return (
        <div className='flex flex-col flex-1 gap-6 min-h-0'>
            {!m && (
                <div className='flex justify-between -mb-4'>
                    <DomainSelector domains={domainOptions} selectedDomain={selectedDomain} />
                </div>
            )}

            {recs && recs.length > 0 && (
                <div className='flex-1 flex flex-col min-h-0 w-full max-w-full overflow-hidden'>
                    <Table
                        headers={['timestamp', 'status', 'duration', 'method', 'path', 'domain', 'iso']}
                        list={recs.map(r => ({
                            timestamp: (
                                <span className='text-sm tabular-nums text-login-50 font-semibold'>
                                    {formatTime(r.timestamp)}
                                </span>
                            ),
                            status: (
                                <span className={`px-2 py-0.5 rounded text-sm font-bold border ${statusClasses(r.status)}`}>
                                    {r.status}
                                </span>
                            ),
                            duration: (
                                <span className={`tabular-nums text-sm font-bold ${getDurationColor(r.request_time)}`}>
                                    {r.request_time}ms
                                </span>
                            ),
                            method: <span className='text-sm font-bold text-login-50 uppercase'>{r.method}</span>,
                            path: (
                                <div className='block w-[18rem] max-w-[18rem] min-w-0 overflow-hidden' title={r.path}>
                                    <Marquee
                                        text={r.path}
                                        className='w-full max-w-[18rem]'
                                        innerClassName='text-sm font-medium text-login-50'
                                    />
                                </div>
                            ),
                            domain: (
                                <div className='block w-[12rem] max-w-[12rem] min-w-0 overflow-hidden' title={r.domain}>
                                    <Marquee
                                        text={r.domain}
                                        className='w-full max-w-[12rem]'
                                        innerClassName='text-sm text-muted-foreground opacity-70'
                                    />
                                </div>
                            ),
                            iso: (
                                <span className='text-xs font-bold text-muted-foreground opacity-70 uppercase tracking-widest'>
                                    {r.country_iso || '??'}
                                </span>
                            )
                        }))}
                        hideMenu
                    />
                </div>
            )}

            {m && (
                <div className='flex flex-col gap-6 pt-2'>
                    {recs.length > 0 && <hr className='border-white/5' />}

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <StatCard
                            title='Total Requests'
                            value={totalRequests.toLocaleString()}
                            icon={Globe}
                            tone='blue'
                        />
                        <StatCard
                            title='Avg Response'
                            value={avgRequestTime ? `${avgRequestTime}ms` : '—'}
                            icon={Clock}
                            tone='amber'
                        />
                        <StatCard
                            title='Error Rate'
                            value={errorRate ? `${errorRate}%` : '—'}
                            icon={ShieldAlert}
                            tone='rose'
                        />
                    </div>

                    <div className='flex justify-between items-center -my-2'>
                        <div className='flex items-center gap-4 flex-1'>
                            <DomainSelector
                                domains={domainOptions}
                                selectedDomain={selectedDomain}
                            />
                            {selectedDomain && (
                                <div
                                    className={[
                                        'flex items-center gap-2 px-3 py-1 bg-login-orange/10',
                                        'border border-login-orange/20 rounded-full'
                                    ].join(' ')}
                                >
                                    <span className='w-1.5 h-1.5 rounded-full bg-login-orange animate-pulse' />
                                    <span className='text-xs text-login-orange font-semibold uppercase tracking-wider'>
                                        Monitoring {selectedDomain}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
                        {allMetrics.map(({ title, data, isChart }) => {
                            if (Array.isArray(data[0])) {
                                return (
                                    <CombinedMetrics
                                        key={Array.isArray(title) ? title.join(' ') : title}
                                        title={title as string[]}
                                        data={data as TrafficEntry[][]}
                                        total={totalRequests}
                                    />
                                )
                            }
                            if (isChart) {
                                return (
                                    <div
                                        className='bg-login-50/5 p-4 rounded-xl border border-white/5 min-h-50 flex flex-col'
                                        key={title as string}
                                    >
                                        <div className='flex items-center justify-between mb-4'>
                                            <h3 className='text-xs font-semibold uppercase tracking-[0.15em] text-login-200'>
                                                {title as string}
                                            </h3>
                                            <Activity className='w-3 h-3 text-login-200/40' />
                                        </div>
                                        <div className='flex-1'>
                                            <RequestsOverTimeChart data={data as { key: string; count: number }[]} />
                                        </div>
                                    </div>
                                )
                            }
                            const set = data as TrafficEntry[]
                            const isBrowserOrOS = Array.isArray(title)
                                || (typeof title === 'string'
                                    && (title.includes('Operating') || title.includes('Browsers')))
                            const Icon = isBrowserOrOS ? Monitor : Cpu

                            return (
                                <div
                                    className='bg-login-50/5 p-4 rounded-xl border border-white/5 min-h-50'
                                    key={typeof title === 'string' ? title : title[0]}
                                >
                                    <div className='flex items-center justify-between mb-4'>
                                        <h3 className='text-xs font-semibold uppercase tracking-[0.15em] text-login-200'>
                                            {Array.isArray(title) ? title[0] : title}
                                        </h3>
                                        <Icon className='w-3 h-3 text-login-200/40' />
                                    </div>
                                    <div className='space-y-3'>
                                        {set.slice(0, 6).map((entry) => (
                                            <Bar
                                                key={entry.key}
                                                label={entry.key}
                                                value={'count' in entry ? (entry.count || 0) : Math.round(entry.avg_time || 0)}
                                                total={totalRequests}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

function StatCard({
    title,
    value,
    tone = 'slate',
    icon: Icon
}: {
    title: string
    value: string | number
    tone?: 'blue' | 'amber' | 'emerald' | 'rose' | 'violet' | 'slate'
    icon: LucideIcon
}) {
    const tones = {
        blue: { bg: 'bg-sky-500/15', icon: 'text-sky-400', border: 'border-sky-500/10' },
        amber: { bg: 'bg-amber-500/15', icon: 'text-amber-400', border: 'border-amber-500/10' },
        emerald: { bg: 'bg-emerald-500/15', icon: 'text-emerald-400', border: 'border-emerald-500/10' },
        rose: { bg: 'bg-rose-500/15', icon: 'text-rose-400', border: 'border-rose-500/10' },
        violet: { bg: 'bg-violet-500/15', icon: 'text-violet-400', border: 'border-violet-500/10' },
        slate: { bg: 'bg-login-100/15', icon: 'text-login-300', border: 'border-login-100/10' },
    } as const

    const activeTone = tones[tone]

    return (
        <div
            className={`bg-login-50/5 p-4 rounded-xl border ${activeTone.border} transition-all hover:bg-login-50/10 group`}
        >
            <div className='flex items-center gap-3 mb-3'>
                <div className={`p-2 rounded-lg ${activeTone.bg} group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-4 h-4 ${activeTone.icon}`} strokeWidth={2.5} />
                </div>
                <span className='text-sm font-medium text-muted-foreground capitalize'>{title}</span>
            </div>
            <div className='text-2xl font-bold tracking-tight text-login-50' title={String(value)}>
                {value}
            </div>
        </div>
    )
}
