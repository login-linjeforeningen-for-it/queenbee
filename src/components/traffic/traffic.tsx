import { Activity, Clock, AlertTriangle } from 'lucide-react'

type TrafficDashboardProps = {
    metrics?: TrafficMetricsProps | string
    records?: TrafficRecordsProps | string
}

export default function TrafficDashboard({ metrics, records }: TrafficDashboardProps) {
    const m = typeof metrics === 'object' && metrics !== null ? (metrics as TrafficMetricsProps) : undefined

    const totalRequests = Number(m?.total_requests) || 0
    const avgRequestTime = Number.isFinite(Number(m?.avg_request_time)) ? Math.round(Number(m!.avg_request_time)) : null
    const errorRate = Number.isFinite(Number(m?.error_rate)) ? (Number(m!.error_rate) * 100).toFixed(1) : null

    const methods = (m?.top_methods ?? []) as TrafficMetricsTop[]
    const statuses = (m?.top_status_codes ?? []) as TrafficMetricsTop[]
    const domains = (m?.top_domains ?? []) as TrafficMetricsTop[]
    const os = (m?.top_os ?? []) as TrafficMetricsTop[]

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
                        {[
                            {
                                title: 'Methods',
                                data: methods
                            },
                            {
                                title: 'Status Codes',
                                data: statuses
                            },
                            {
                                title: 'Domains',
                                data: domains
                            },
                            {
                                title: 'Operating Systems',
                                data: os
                            },
                        ].map(({ title, data: set }) => (
                            <div className='bg-white/5 p-4 rounded-lg' key={title}>
                                <h3 className='text-lg font-semibold mb-4'>{title}</h3>
                                <div className='space-y-2'>
                                    {set.map((entry: TrafficMetricsTop) => (
                                        <Bar key={entry.key} label={entry.key} value={entry.count} total={totalRequests} />
                                    ))}
                                </div>
                            </div>
                        ))}
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

function statusClasses(status: number) {
    if (status >= 400) return 'bg-red-500/20 text-red-400'
    if (status >= 300) return 'bg-yellow-500/20 text-yellow-400'
    return 'bg-green-500/20 text-green-400'
}
