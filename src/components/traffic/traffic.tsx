'use client'

import { Activity, Clock, AlertTriangle } from 'lucide-react'
import statusClasses from './statusClasses'
import RequestsOverTimeChart from './requestsOverTimeChart'
import CombinedMetrics from './combinedMetrics'
import Bar from './bar'

type TrafficDashboardProps = {
    metrics?: TrafficMetricsProps | string
    records?: TrafficRecordsProps | string
    selectedDomain?: string
    domainOptions?: string[]
}

type StatCardProps = {
    title: string
    value: string | number
    accent?: 'blue' | 'emerald' | 'amber' | 'rose' | 'violet' | 'cyan' | 'slate'
    outline?: string
    icon: React.ReactNode
}

import DomainSelector from './domainSelector'

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

    return (
        <div className='flex flex-col h-full'>
            <div className='flex flex-row justify-between mt-3 mb-2'>
                <h1 className='font-semibold text-lg text-login-50'>Traffic Metrics</h1>
            </div>

            {m && (
                <>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <StatCard
                            title='Total Requests'
                            value={totalRequests || '—'}
                            tone='amber'
                            icon={Activity}
                        />
                        <StatCard
                            title='Avg Request Time'
                            value={avgRequestTime ? `${avgRequestTime}ms` : '—'}
                            tone='blue'
                            icon={Clock}
                        />
                        <StatCard
                            title='Error Rate'
                            value={errorRate ? `${errorRate}%` : '—'}
                            tone='rose'
                            icon={AlertTriangle}
                        />
                    </div>

                    <div className='flex items-center py-3 gap-4 w-full'>
                        <div className='flex items-center gap-4 flex-1 w-full'>
                            <DomainSelector domains={domainOptions} selectedDomain={selectedDomain} />
                            {selectedDomain && (
                                <span className='text-sm text-muted-foreground'>
                                    Viewing <span className='text-sky-400 font-medium'>{selectedDomain}</span>
                                </span>
                            )}
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2'>
                        {allMetrics.map(({ title, data, isChart }) => {
                            if (Array.isArray(data[0])) {
                                return (
                                    <CombinedMetrics
                                        key={Array.isArray(title) ? title.join(' ') : title}
                                        title={title as string[]}
                                        data={data as Entry[][]}
                                        total={totalRequests}
                                    />
                                )
                            }
                            if (isChart) {
                                return (
                                    <div className='bg-login-50/5 p-4 rounded-xl border border-white/5 min-h-[200px]' key={title as string}>
                                        <h3 className='text-xs font-semibold uppercase tracking-[0.15em] text-login-200 mb-4'>{title as string}</h3>
                                        <RequestsOverTimeChart data={data as { key: string; count: number }[]} />
                                    </div>
                                )
                            }
                            const set = data as Entry[]
                            return (
                                <div className='bg-login-50/5 p-4 rounded-xl border border-white/5 min-h-[200px]' key={title as string}>
                                    <h3 className='text-xs font-semibold uppercase tracking-[0.15em] text-login-200 mb-4'>{title as string}</h3>
                                    <div className='space-y-2'>
                                        {set.map((entry) => (
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
                </>
            )}

            {recs && recs.length > 0 && (
                <div className='bg-login-50/5 rounded-xl border border-white/5 overflow-hidden mt-6'>
                    <div className='p-4 border-b border-white/10'>
                        <h3 className='text-xs font-semibold uppercase tracking-[0.15em] text-login-200'>Recent Traffic</h3>
                    </div>
                    <div className='overflow-x-auto'>
                        <table className='w-full text-sm text-left table-fixed'>
                            <thead className='text-[10px] uppercase tracking-wider bg-login-50/5 text-muted-foreground'>
                                <tr>
                                    <th className='px-4 py-3 font-bold'>Date</th>
                                    <th className='px-4 py-3 font-bold w-20'>Method</th>
                                    <th className='px-4 py-3 font-bold'>Path</th>
                                    <th className='px-4 py-3 font-bold w-24'>Status</th>
                                    <th className='px-4 py-3 font-bold w-24'>Duration</th>
                                    <th className='px-4 py-3 max-w-[18rem] truncate font-bold'>Domain</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-white/5'>
                                {recs.map((req, i) => (
                                    <tr key={i} className='hover:bg-login-50/5 transition-colors'>
                                        <td className='px-4 py-2.5 text-xs text-muted-foreground tabular-nums'>
                                            {new Date(req.timestamp).toLocaleString('nb-NO')}
                                        </td>
                                        <td className='px-4 py-2.5'>
                                            <span className='font-mono font-bold text-login-200 uppercase'>{req.method}</span>
                                        </td>
                                        <td className='px-4 py-2.5 truncate font-medium text-login-50' title={req.path}>{req.path}</td>
                                        <td className='px-4 py-2.5'>
                                            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusClasses(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className='px-4 py-2.5 text-xs tabular-nums text-login-100'>{req.request_time}ms</td>
                                        <td className='px-4 py-2.5 max-w-[18rem] truncate text-xs text-muted-foreground' title={req.domain}>{req.domain}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
    icon: any
}) {
    const tones = {
        blue: { bg: 'bg-sky-500/15', icon: 'text-sky-400' },
        amber: { bg: 'bg-amber-500/15', icon: 'text-amber-400' },
        emerald: { bg: 'bg-emerald-500/15', icon: 'text-emerald-400' },
        rose: { bg: 'bg-rose-500/15', icon: 'text-rose-400' },
        violet: { bg: 'bg-violet-500/15', icon: 'text-violet-400' },
        slate: { bg: 'bg-login-100/15', icon: 'text-login-300' },
    } as const

    const activeTone = tones[tone]

    return (
        <div className='bg-login-50/5 p-4 rounded-xl border border-white/5'>
            <div className='flex items-center gap-3 mb-3'>
                <div className={`p-2 rounded-lg ${activeTone.bg}`}>
                    <Icon className={`w-4 h-4 ${activeTone.icon}`} strokeWidth={2.5} />
                </div>
                <span className='text-sm font-medium text-muted-foreground capitalize'>{title}</span>
            </div>
            <div className='text-lg font-semibold truncate text-login-50' title={String(value)}>
                {value}
            </div>
        </div>
    )
}
