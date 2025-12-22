'use client'

import { Activity, Clock, AlertTriangle, LucideChartNoAxesGantt } from 'lucide-react'
import { useState } from 'react'
import { Button } from 'uibee/components'

type TrafficDashboardProps = {
    metrics?: TrafficMetricsProps | string
    records?: TrafficRecordsProps | string
    selectedDomain?: string
}

type Entry = { key: string, count?: number, avg_time?: number }

export default function TrafficDashboard({ metrics, records, selectedDomain }: TrafficDashboardProps) {
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
        <div className='space-y-6'>
            {m && (
                <>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        {[
                            {
                                title: 'Total Requests',
                                value: totalRequests || '—',
                                icon: <Activity className='w-5 h-5' />
                            },
                            {
                                title: 'Avg Request Time',
                                value: avgRequestTime ? `${avgRequestTime}ms` : '—',
                                icon: <Clock className='w-5 h-5' />
                            },
                            {
                                title: 'Error Rate',
                                value: errorRate ? `${errorRate}%` : '—',
                                icon: <AlertTriangle className='w-5 h-5' />
                            },
                        ].map(({ title, value, icon }) => (
                            <StatCard key={title} title={title} value={value} icon={icon} />
                        ))}
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                                    <div className='bg-white/5 p-4 rounded-lg' key={title as string}>
                                        <h3 className='text-lg font-semibold mb-4'>{title as string}</h3>
                                        <RequestsOverTimeChart data={data as { key: string; count: number }[]} />
                                    </div>
                                )
                            }
                            const set = data as Entry[]
                            return (
                                <div className='bg-white/5 p-4 rounded-lg' key={title as string}>
                                    <h3 className='text-lg font-semibold mb-4'>{title as string}</h3>
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

            {recs && recs.length > 0 &&
                <div className='bg-white/5 rounded-lg overflow-hidden'>
                    <div className='p-4 border-b border-white/10'>
                        <h3 className='text-lg font-semibold'>Recent Traffic</h3>
                    </div>
                    <div className='overflow-x-auto'>
                        <table className='w-full text-sm text-left table-fixed'>
                            <thead className='text-xs uppercase bg-white/5 text-muted-foreground'>
                                <tr>
                                    <th className='px-4 py-3'>Date</th>
                                    <th className='px-4 py-3'>Method</th>
                                    <th className='px-4 py-3'>Path</th>
                                    <th className='px-4 py-3'>Status</th>
                                    <th className='px-4 py-3'>Duration</th>
                                    <th className='px-4 py-3 max-w-[18rem] truncate'>Domain</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recs.map((req, i) => (
                                    <tr key={i} className='border-b border-white/5 hover:bg-white/5'>
                                        <td className='px-4 py-3 text-muted-foreground'>
                                            {new Date(req.timestamp).toLocaleString()}
                                        </td>
                                        <td className='px-4 py-3 font-medium'>{req.method}</td>
                                        <td className='px-4 py-3'>{req.path}</td>
                                        <td className='px-4 py-3'>
                                            <span className={`px-2 py-1 rounded text-xs ${statusClasses(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className='px-4 py-3'>{req.request_time}ms</td>
                                        <td className='px-4 py-3 max-w-[18rem] truncate'>{req.domain}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            }
        </div>
    )
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
    return (
        <div className='bg-white/5 p-4 rounded-lg flex items-center justify-between'>
            <div>
                <p className='text-sm text-muted-foreground'>{title}</p>
                <p className='text-2xl font-bold mt-1'>{value}</p>
            </div>
            <div className='p-3 bg-white/5 rounded-full'>
                {icon}
            </div>
        </div>
    )
}

function Bar({ label, value, total }: { label: string, value: number, total: number }) {
    const percentage = total ? (value / total) * 100 : 0
    return (
        <div className='flex items-center gap-4 min-w-0'>
            <div className='w-24 md:w-36 text-sm font-medium truncate' title={label}>{label}</div>
            <div className='flex-1 h-2 bg-white/5 rounded-full overflow-hidden'>
                <div
                    className='h-full bg-blue-500 rounded-full'
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className='w-12 text-sm text-right text-muted-foreground'>{value}</div>
        </div>
    )
}

function CombinedMetrics({ title, data, total }: {
    title: string[],
    data: Entry[][],
    total: number
}) {
    const [index, setIndex] = useState(0)
    const currentData = data[index]
    const currentTitle = title[index]
    const buttonText = `Switch to ${title[1 - index]}`
    return (
        <div className='bg-white/5 p-4 rounded-lg'>
            <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-semibold'>{currentTitle}</h3>
                <Button
                    icon={<LucideChartNoAxesGantt className='w-5' />}
                    text={buttonText}
                    onClick={() => setIndex(index === 0 ? 1 : 0)}
                />
            </div>
            <div className='space-y-2'>
                {currentData.map((entry) => (
                    <Bar
                        key={entry.key}
                        label={entry.key} value={'count' in entry ? (entry.count || 0) : Math.round(entry.avg_time || 0)}
                        total={total} />
                ))}
            </div>
        </div>
    )
}

function RequestsOverTimeChart({ data }: { data: { key: string, count: number }[] }) {
    if (!data || data.length === 0) return <div className='p-4 text-sm text-muted-foreground'>No data available</div>

    const width = 620
    const height = 132
    const padding = { top: 10, right: 10, bottom: 20, left: 35 }

    const maxCount = Math.max(...data.map(d => d.count))
    const minCount = 0

    function xScale(index: number) {
        return (index / (data.length - 1)) * (width - padding.left - padding.right) + padding.left
    }

    function yScale(count: number) {
        return height - padding.bottom - ((count - minCount)
        / (maxCount - minCount || 1)) * (height - padding.top - padding.bottom)
    }

    const points = data.map((d, i) => `${xScale(i)},${yScale(d.count)}`).join(' ')
    const areaPoints = `${xScale(0)},${height - padding.bottom} ${points} ${xScale(data.length - 1)},${height - padding.bottom}`

    const yTicks = []
    const numYTicks = 3
    for (let i = 0; i <= numYTicks; i++) {
        const count = minCount + (maxCount - minCount) * (i / numYTicks)
        yTicks.push({ count: Math.round(count), y: yScale(count) })
    }

    const xTicks = []
    const numXTicks = 6
    const step = Math.max(1, Math.floor((data.length - 1) / (numXTicks - 1)))
    for (let i = 0; i < data.length; i += step) {
        xTicks.push({ index: i, x: xScale(i), label: data[i].key })
    }

    function parseDate(str: string) {
        let d = new Date(str)
        if (isNaN(d.getTime())) {
            d = new Date(str.replace(' ', 'T'))
        }
        return isNaN(d.getTime()) ? null : d
    }

    const startDate = parseDate(data[0]?.key || '')
    const endDate = parseDate(data[data.length - 1]?.key || '')
    const showDate = startDate && endDate && (endDate.getTime() - startDate.getTime() > 86400000)

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className='w-full h-auto overflow-visible'>
            <defs>
                <linearGradient id='chartGradient' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor='#3b82f6' stopOpacity='0.2' />
                    <stop offset='100%' stopColor='#3b82f6' stopOpacity='0' />
                </linearGradient>
            </defs>

            {yTicks.map((tick, i) => (
                <line
                    key={`y-grid-${i}`}
                    x1={padding.left}
                    y1={tick.y}
                    x2={width - padding.right}
                    y2={tick.y}
                    stroke='currentColor'
                    strokeOpacity={0.1}
                    strokeDasharray='4 4'
                />
            ))}

            <polygon points={areaPoints} fill='url(#chartGradient)' />

            <polyline points={points} fill='none' stroke='#3b82f6' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' />

            {data.length < 30 && data.map((d, i) => (
                <circle key={i} cx={xScale(i)} cy={yScale(d.count)} r={3} fill='#3b82f6' />
            ))}

            {yTicks.map((tick, i) => (
                <text
                    key={`y-label-${i}`}
                    x={padding.left - 8}
                    y={tick.y + 3}
                    textAnchor='end'
                    className='text-[10px] fill-current opacity-70'
                    style={{ fontSize: '10px' }}
                >
                    {tick.count}
                </text>
            ))}

            {xTicks.map((tick, i) => {
                const date = parseDate(tick.label)
                let label = tick.label
                if (date) {
                    if (showDate) {
                        label = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                    } else {
                        label = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                } else {
                    const parts = tick.label.split(' ')
                    label = parts.length > 1 ? parts[1] : tick.label.substring(0, 10)
                }

                return (
                    <text
                        key={`x-label-${i}`}
                        x={tick.x}
                        y={height - padding.bottom + 15}
                        textAnchor='middle'
                        className='text-[10px] fill-current opacity-70'
                        style={{ fontSize: '10px' }}
                    >
                        {label}
                    </text>
                )
            })}
        </svg>
    )
}

function statusClasses(status: number) {
    if (status >= 400) return 'bg-red-500/20 text-red-400'
    if (status >= 300) return 'bg-yellow-500/20 text-yellow-400'
    return 'bg-green-500/20 text-green-400'
}
