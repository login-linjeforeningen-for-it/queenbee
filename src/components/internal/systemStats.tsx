'use client'

import { Boxes, Cpu, HardDrive, MemoryStick, Server, Thermometer, Zap, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import getInternalDashboard from '@utils/api/beekeeper/dashboard/get'

type SystemStatsProps = {
    initialDashboard: InternalDashboard
}

const refreshOptions = [
    { label: 'Off', value: 0 },
    { label: '1s', value: 1000 },
    { label: '3s', value: 3000 },
    { label: '5s', value: 5000 },
    { label: '10s', value: 10000 },
    { label: '30s', value: 30000 },
    { label: '1m', value: 60000 },
    { label: '5m', value: 300000 },
]

export default function SystemStats({ initialDashboard }: SystemStatsProps) {
    const [metrics, setMetrics] = useState(initialDashboard.runtime.metrics)
    const [docker, setDocker] = useState(initialDashboard.runtime.docker)
    const [information, setInformation] = useState(initialDashboard.information)
    const [autoRefresh, setAutoRefresh] = useState(10000)

    const usedMemory = metrics?.system?.memory?.used ? (metrics.system.memory.used / 1073741824).toFixed(2) : '0.00'
    const totalMemory = metrics?.system?.memory?.total ? (metrics.system.memory.total / 1073741824).toFixed(2) : '0.00'
    const usedMemoryPercentage = metrics?.system?.memory?.percent || '0'

    useEffect(() => {
        if (autoRefresh === 0) {
            return
        }

        const intervalId = setInterval(async () => {
            const updatedDashboard = await getInternalDashboard()
            setMetrics(updatedDashboard.runtime.metrics)
            setDocker(updatedDashboard.runtime.docker)
            setInformation(updatedDashboard.information)
        }, autoRefresh)

        return () => clearInterval(intervalId)
    }, [autoRefresh])

    function handleAutoRefresh(e: React.ChangeEvent<HTMLSelectElement>) {
        const selectedOption = refreshOptions.find(opt => opt.label === e.target.value)
        if (selectedOption) {
            setAutoRefresh(selectedOption.value)
        }
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
                <h2 className='text-xl font-semibold'>System Resources</h2>
                <div className='flex items-center gap-3 bg-login-50/5 p-1 rounded-lg border border-white/5'>
                    <span className='px-2 text-xs font-medium text-muted-foreground uppercase'>Auto-refresh</span>
                    <select
                        className='bg-transparent text-sm font-medium outline-none cursor-pointer'
                        value={refreshOptions.find(opt => opt.value === autoRefresh)?.label || '10s'}
                        onChange={handleAutoRefresh}
                    >
                        {refreshOptions.map(option => (
                            <option key={option.label} value={option.label} className='bg-zinc-900'>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
                <a href='/internal/loadbalancing' className='bg-login-50/5 p-4 rounded-xl border border-white/5'>
                    <div className='flex items-center gap-3 mb-3'>
                        <div className='p-2 bg-emerald-500/10 rounded-lg'>
                            <Star className='w-4 h-4 text-emerald-500' />
                        </div>
                        <span className='text-sm font-medium text-muted-foreground'>Primary Site</span>
                    </div>
                    <div className='flex gap-2 flex-col font-mono text-sm'>
                        <div className='flex justify-between items-center text-xs text-muted-foreground'>
                            <span>ID</span>
                            <span className='font-semibold text-login-200'>{information.primarySite.id}</span>
                        </div>
                        <div className='flex justify-between items-center text-xs text-muted-foreground'>
                            <span>IP</span>
                            <span className='font-semibold text-login-200'>{information.primarySite.ip}</span>
                        </div>
                        <div className='flex justify-between items-center text-xs text-muted-foreground'>
                            <span>Name</span>
                            <span className='font-semibold text-login-200'>{information.primarySite.name}</span>
                        </div>
                    </div>
                </a>

                {/* OS Info */}
                <div className='bg-login-50/5 p-4 rounded-xl border border-white/5'>
                    <div className='flex items-center gap-3 mb-3'>
                        <div className='p-2 bg-blue-500/10 rounded-lg'>
                            <Server className='w-4 h-4 text-blue-500' />
                        </div>
                        <span className='text-sm font-medium text-muted-foreground'>Operating System</span>
                    </div>
                    <div className='text-lg font-semibold truncate' title={metrics?.system?.os}>
                        {metrics?.system?.os || 'Unknown'}
                    </div>
                </div>

                {/* System Load */}
                <div className='bg-login-50/5 p-4 rounded-xl border border-white/5 lg:col-span-2 xl:col-span-1'>
                    <div className='flex items-center gap-3 mb-4'>
                        <div className='p-2 bg-emerald-500/10 rounded-lg'>
                            <Cpu className='w-4 h-4 text-emerald-500' />
                        </div>
                        <span className='text-sm font-medium text-muted-foreground'>System Load Average</span>
                    </div>
                    <div className='grid grid-cols-3 gap-2 text-center divide-x divide-white/5'>
                        <div>
                            <div className='text-xs text-muted-foreground mb-1'>1m</div>
                            <div className='text-base font-bold'>{metrics?.system?.load?.[0] || '0'}%</div>
                        </div>
                        <div>
                            <div className='text-xs text-muted-foreground mb-1'>5m</div>
                            <div className='text-base font-bold'>{metrics?.system?.load?.[1] || '0'}%</div>
                        </div>
                        <div>
                            <div className='text-xs text-muted-foreground mb-1'>15m</div>
                            <div className='text-base font-bold'>{metrics?.system?.load?.[2] || '0'}%</div>
                        </div>
                    </div>
                </div>

                {/* Memory Usage */}
                <div className='bg-login-50/5 p-4 rounded-xl border border-white/5 lg:col-span-2'>
                    <div className='flex items-center justify-between mb-3'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-sky-500/10 rounded-lg'>
                                <MemoryStick className='w-4 h-4 text-sky-500' />
                            </div>
                            <span className='text-sm font-medium text-muted-foreground'>Memory Usage</span>
                        </div>
                        <span className='text-sm font-bold text-sky-500'>{usedMemoryPercentage}%</span>
                    </div>
                    <div className='space-y-2'>
                        <div className='h-2 bg-zinc-800 rounded-full overflow-hidden'>
                            <div
                                className='h-full bg-sky-500 transition-all duration-500'
                                style={{ width: `${Math.min(Number(usedMemoryPercentage), 100)}%` }}
                            />
                        </div>
                        <div className='flex justify-between text-xs text-muted-foreground'>
                            <span>{usedMemory} GB Used</span>
                            <span>{totalMemory} GB Total</span>
                        </div>
                    </div>
                </div>

                {/* Disk Usage */}
                <div className='bg-login-50/5 p-4 rounded-xl border border-white/5'>
                    <div className='flex items-center gap-3 mb-3'>
                        <div className='p-2 bg-orange-500/10 rounded-lg'>
                            <HardDrive className='w-4 h-4 text-orange-500' />
                        </div>
                        <span className='text-sm font-medium text-muted-foreground'>Disk Usage</span>
                    </div>
                    <div className='text-lg font-semibold'>
                        {metrics?.system?.disk || 'Unknown'}
                    </div>
                </div>

                {/* Temperature */}
                <div className='bg-login-50/5 p-4 rounded-xl border border-white/5'>
                    <div className='flex items-center gap-3 mb-3'>
                        <div className='p-2 bg-red-500/10 rounded-lg'>
                            <Thermometer className='w-4 h-4 text-red-500' />
                        </div>
                        <span className='text-sm font-medium text-muted-foreground'>Temperature</span>
                    </div>
                    <div className='text-lg font-semibold'>
                        {metrics?.system?.temperature || 'Unknown'}
                    </div>
                </div>

                {/* Power Usage */}
                <div className='bg-login-50/5 p-4 rounded-xl border border-white/5'>
                    <div className='flex items-center gap-3 mb-3'>
                        <div className='p-2 bg-yellow-500/10 rounded-lg'>
                            <Zap className='w-4 h-4 text-yellow-500' />
                        </div>
                        <span className='text-sm font-medium text-muted-foreground'>Power Draw</span>
                    </div>
                    <div className='text-lg font-semibold'>
                        {metrics?.system?.powerUsage || 'Unknown'}
                    </div>
                </div>

                {/* Processes */}
                <div className='bg-login-50/5 p-4 rounded-xl border border-white/5'>
                    <div className='flex items-center gap-3 mb-3'>
                        <div className='p-2 bg-purple-500/10 rounded-lg'>
                            <Boxes className='w-4 h-4 text-purple-500' />
                        </div>
                        <span className='text-sm font-medium text-muted-foreground'>Total Processes</span>
                    </div>
                    <div className='text-2xl font-bold'>
                        {metrics?.system?.processes || '0'}
                    </div>
                </div>

                {/* Containers */}
                <div className='bg-login-50/5 p-4 rounded-xl border border-white/5'>
                    <div className='flex items-center gap-3 mb-3'>
                        <div className='p-2 bg-cyan-500/10 rounded-lg'>
                            <Boxes className='w-4 h-4 text-cyan-500' />
                        </div>
                        <span className='text-sm font-medium text-muted-foreground'>Active Containers</span>
                    </div>
                    <div className='text-2xl font-bold'>
                        {docker.count}
                    </div>
                </div>
            </div>

            {/* Network IPs */}
            <div className='bg-login-50/5 p-4 rounded-xl border border-white/5'>
                <div className='flex items-center gap-3 mb-4'>
                    <div className='p-2 bg-indigo-500/10 rounded-lg'>
                        <MemoryStick className='w-4 h-4 text-indigo-500' />
                    </div>
                    <span className='text-sm font-medium text-muted-foreground'>Network Interfaces</span>
                </div>
                <div className='grid md:grid-cols-2 gap-6'>
                    <div>
                        <div className='text-xs uppercase tracking-wider text-muted-foreground mb-2 font-semibold'>IPv4 Addresses</div>
                        <div className='bg-black/20 rounded-lg p-3 font-mono text-sm text-indigo-300'>
                            {metrics?.system?.ipv4?.length ? (
                                metrics.system.ipv4.map((ip, i) => (
                                    <div key={i}>{ip}</div>
                                ))
                            ) : <span className='text-muted-foreground'>No IPv4 addresses found</span>}
                        </div>
                    </div>
                    <div>
                        <div className='text-xs uppercase tracking-wider text-muted-foreground mb-2 font-semibold'>IPv6 Addresses</div>
                        <div className='bg-black/20 rounded-lg p-3 font-mono text-xs text-indigo-300 break-all'>
                            {metrics?.system?.ipv6?.length ? (
                                metrics.system.ipv6.map((ip, i) => (
                                    <div key={i}>{ip}</div>
                                ))
                            ) : <span className='text-muted-foreground'>No IPv6 addresses found</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
