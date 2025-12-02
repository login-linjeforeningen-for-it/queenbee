import {
    Activity,
    Clock,
    AlertTriangle,
} from 'lucide-react'
import data from './data.json'

export default function TrafficDashboard() {
    const totalRequests = data.length
    const avgRequestTime = Math.round(data.reduce((acc, curr) => acc + curr.request_time, 0) / totalRequests)
    const errorCount = data.filter(d => d.status >= 400).length
    const errorRate = ((errorCount / totalRequests) * 100).toFixed(1)

    const methods = data.reduce((acc, curr) => {
        acc[curr.method] = (acc[curr.method] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const statuses = data.reduce((acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    return (
        <div className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <StatCard
                    title='Total Requests'
                    value={totalRequests}
                    icon={<Activity className='w-5 h-5' />}
                />
                <StatCard
                    title='Avg Request Time'
                    value={`${avgRequestTime}ms`}
                    icon={<Clock className='w-5 h-5' />}
                />
                <StatCard
                    title='Error Rate'
                    value={`${errorRate}%`}
                    icon={<AlertTriangle className='w-5 h-5' />}
                />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='bg-white/5 p-4 rounded-lg'>
                    <h3 className='text-lg font-semibold mb-4'>Methods</h3>
                    <div className='space-y-2'>
                        {Object.entries(methods).map(([method, count]) => (
                            <Bar key={method} label={method} value={count} total={totalRequests} />
                        ))}
                    </div>
                </div>
                <div className='bg-white/5 p-4 rounded-lg'>
                    <h3 className='text-lg font-semibold mb-4'>Status Codes</h3>
                    <div className='space-y-2'>
                        {Object.entries(statuses).map(([status, count]) => (
                            <Bar key={status} label={status} value={count} total={totalRequests} />
                        ))}
                    </div>
                </div>
            </div>

            <div className='bg-white/5 rounded-lg overflow-hidden'>
                <div className='p-4 border-b border-white/10'>
                    <h3 className='text-lg font-semibold'>Recent Traffic</h3>
                </div>
                <div className='overflow-x-auto'>
                    <table className='w-full text-sm text-left'>
                        <thead className='text-xs uppercase bg-white/5 text-muted-foreground'>
                            <tr>
                                <th className='px-4 py-3'>Date</th>
                                <th className='px-4 py-3'>Method</th>
                                <th className='px-4 py-3'>Path</th>
                                <th className='px-4 py-3'>Status</th>
                                <th className='px-4 py-3'>Duration</th>
                                <th className='px-4 py-3'>Domain</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.slice(0, 10).map((req, i) => (
                                <tr key={i} className='border-b border-white/5 hover:bg-white/5'>
                                    <td className='px-4 py-3 text-muted-foreground'>
                                        {new Date(req.timestamp * 1000).toLocaleString()}
                                    </td>
                                    <td className='px-4 py-3 font-medium'>{req.method}</td>
                                    <td className='px-4 py-3'>{req.path}</td>
                                    <td className='px-4 py-3'>
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            req.status >= 400 ? 'bg-red-500/20 text-red-400' :
                                                req.status >= 300 ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-green-500/20 text-green-400'
                                        }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className='px-4 py-3'>{req.request_time}ms</td>
                                    <td className='px-4 py-3'>{req.domain}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
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
    const percentage = (value / total) * 100
    return (
        <div className='flex items-center gap-4'>
            <div className='w-16 text-sm font-medium'>{label}</div>
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
