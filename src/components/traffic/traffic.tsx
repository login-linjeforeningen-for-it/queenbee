'use client'

import { Activity, Clock, Globe, ShieldAlert, Cpu, Monitor } from 'lucide-react'
import { Card, StatCard } from 'uibee/components'
import RequestsOverTimeChart from './requestsOverTimeChart'
import CombinedMetrics from './combinedMetrics'
import Bar from './bar'
import ManagedTable from '@components/table/managedTable'
import Marquee from '@components/shared/marquee'
import DomainSelector from './domainSelector'
import { TrafficMetricsProps, TrafficRecordsProps, TrafficRecord, TrafficEntry } from '@utils/api/beekeeper/traffic/types'

type TrafficDashboardProps = {
    metrics?: TrafficMetricsProps | string
    records?: TrafficRecordsProps | string
    selectedDomain?: string
    domainOptions?: string[]
    totalRows?: number
    pageSize?: number
}

export default function TrafficDashboard({ metrics, records, selectedDomain, domainOptions = [], totalRows, pageSize }: TrafficDashboardProps) {
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


    return (
        <div className='flex flex-col flex-1 gap-6 min-h-0'>
            {!m && (
                <div className='flex justify-between -mb-4'>
                    <DomainSelector domains={domainOptions} selectedDomain={selectedDomain} />
                </div>
            )}

            {recs && recs.length > 0 && (
                <div className='flex-1 flex flex-col min-h-0 w-full max-w-full overflow-hidden'>
                    <ManagedTable
                        data={recs.map(r => ({
                            _ts: r.timestamp,
                            timestamp: formatTime(r.timestamp),
                            status: r.status >= 500 ? '5xx' : r.status >= 400 ? '4xx' : r.status >= 300 ? '3xx' : '2xx',
                            duration: r.request_time < 200 ? 'fast' : r.request_time < 800 ? 'slow' : 'critical',
                            method: r.method.toUpperCase(),
                            path: r.path,
                            domain: r.domain,
                            iso: r.country_iso || '??',
                        })) as unknown as Record<string, unknown>[]}
                        columns={[
                            { key: 'timestamp' },
                            { key: 'status', highlight: { '2xx': 'green', '3xx': 'blue', '4xx': 'yellow', '5xx': 'red' } },
                            { key: 'duration', highlight: { fast: 'green', slow: 'yellow', critical: 'red' } },
                            { key: 'method' },
                            { key: 'path', render: (v) => (
                                <div className='block w-40 max-w-40 min-w-0 overflow-hidden' title={v as string}>
                                    <Marquee text={v as string} className='w-full max-w-40' innerClassName='text-sm font-medium text-login-50' />
                                </div>
                            )},
                            { key: 'domain', render: (v) => (
                                <div className='block w-28 max-w-28 min-w-0 overflow-hidden' title={v as string}>
                                    <Marquee text={v as string} className='w-full max-w-28' innerClassName='text-sm text-login-300 opacity-70' />
                                </div>
                            )},
                            { key: 'iso' },
                        ]}
                        idKey='_ts'
                        totalRows={totalRows}
                        pageSize={pageSize}
                        hidePagination={!totalRows || !pageSize}
                    />
                </div>
            )}

            {m && (
                <div className='flex flex-col gap-6 pt-2'>
                    {recs.length > 0 && <hr className='border-white/5' />}

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                        <StatCard label='Total Requests' value={totalRequests.toLocaleString()} icon={Globe} />
                        <StatCard label='Avg Response' value={avgRequestTime ? `${avgRequestTime}ms` : '-'} icon={Clock} />
                        <StatCard label='Error Rate' value={errorRate ? `${errorRate}%` : '-'} icon={ShieldAlert} />
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
                                    <Card
                                        className='p-4 min-h-50 flex flex-col'
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
                                    </Card>
                                )
                            }
                            const set = data as TrafficEntry[]
                            const isBrowserOrOS = Array.isArray(title)
                                || (typeof title === 'string'
                                    && (title.includes('Operating') || title.includes('Browsers')))
                            const Icon = isBrowserOrOS ? Monitor : Cpu

                            return (
                                <Card
                                    className='p-4 min-h-50'
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
                                </Card>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

