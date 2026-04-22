'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ChevronDown, RefreshCcw, ServerCrash, TerminalSquare } from 'lucide-react'
import { Toggle } from 'uibee/components'

type LogEntry = {
    raw: string
    message: string
    level: string
    timestamp: string | null
    isError: boolean
    structured: boolean
}

type LogContainer = {
    id: string
    name: string
    service: string
    status: string
    matchedLines: number
    entries: LogEntry[]
}

type LogsPayload = {
    server: string
    checkedAt: string
    filters: {
        service?: string
        container?: string
        search?: string
        level: 'all' | 'error'
        tail: number
    }
    totalContainers: number
    containers: LogContainer[]
}

type ViewMode = 'compact' | 'expanded'

function formatRelativeTime(timestamp: string | null) {
    if (!timestamp) {
        return 'Unknown'
    }

    const parsed = new Date(timestamp)
    if (Number.isNaN(parsed.getTime())) {
        return 'Unknown'
    }

    const diffMs = Date.now() - parsed.getTime()
    const seconds = Math.max(0, Math.floor(diffMs / 1000))
    if (seconds < 60) {
        return `${seconds}s ago`
    }

    const minutes = Math.floor(seconds / 60)
    const restSeconds = seconds % 60
    if (minutes < 60) {
        return restSeconds ? `${minutes}m ${restSeconds}s ago` : `${minutes}m ago`
    }

    const hours = Math.floor(minutes / 60)
    const restMinutes = minutes % 60
    return restMinutes ? `${hours}h ${restMinutes}m ago` : `${hours}h ago`
}

export default function LogsPageClient({ initialData }: { initialData: LogsPayload }) {
    const [data, setData] = useState(initialData)
    const [service, setService] = useState('')
    const [search, setSearch] = useState('')
    const [live, setLive] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<ViewMode>('compact')
    const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({})

    const serviceOptions = useMemo(() =>
        Array.from(new Set(data.containers.map(container => container.service))).sort((a, b) => a.localeCompare(b))
    , [data.containers])

    const summary = useMemo(() => {
        const totalEntries = data.containers.reduce((sum, item) => sum + item.matchedLines, 0)
        const topContainer = data.containers[0] || null
        return { totalEntries, topContainer }
    }, [data])

    function isExpanded(containerId: string) {
        return viewMode === 'expanded' || Boolean(expandedServices[containerId])
    }

    function toggleContainer(containerId: string) {
        setExpandedServices((prev) => ({
            ...prev,
            [containerId]: !prev[containerId],
        }))
    }

    async function refresh(nextService = service, nextSearch = search) {
        setLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams({
                level: 'error',
                tail: '200',
            })

            if (nextService.trim()) {
                params.set('service', nextService.trim())
            }

            if (nextSearch.trim()) {
                params.set('search', nextSearch.trim())
            }

            const response = await fetch(`/api/internal/logs?${params.toString()}`, {
                cache: 'no-store'
            })

            const payload = await response.json()
            if (!response.ok) {
                throw new Error(payload.error || 'Failed to load logs')
            }

            setData(payload)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load logs')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!live) {
            return
        }

        const timer = setInterval(() => {
            void refresh()
        }, 5000)

        return () => clearInterval(timer)
    }, [live, service, search])

    return (
        <div className='flex h-full flex-col gap-4 overflow-hidden'>
            <div className='grid gap-4 md:grid-cols-3'>
                <div className='rounded-2xl border border-white/10 bg-login-50/5 p-4'>
                    <div className='flex items-center gap-2 text-login-200'>
                        <AlertTriangle className='h-4 w-4 text-red-400' />
                        Error entries
                    </div>
                    <div className='mt-3 text-3xl font-semibold text-login-50'>{summary.totalEntries}</div>
                    <div className='mt-1 text-xs text-login-200'>Focused on recent error logs only</div>
                </div>
                <div className='rounded-2xl border border-white/10 bg-login-50/5 p-4'>
                    <div className='flex items-center gap-2 text-login-200'>
                        <TerminalSquare className='h-4 w-4 text-login' />
                        Server
                    </div>
                    <div className='mt-3 text-xl font-semibold text-login-50'>{data.server}</div>
                    <div className='mt-1 text-xs text-login-200'>Updated {formatRelativeTime(data.checkedAt)}</div>
                </div>
                <div className='rounded-2xl border border-white/10 bg-login-50/5 p-4'>
                    <div className='flex items-center gap-2 text-login-200'>
                        <ServerCrash className='h-4 w-4 text-amber-400' />
                        Noisiest service
                    </div>
                    <div className='mt-3 text-xl font-semibold text-login-50'>
                        {summary.topContainer?.service || 'Quiet'}
                    </div>
                    <div className='mt-1 text-xs text-login-200'>
                        {summary.topContainer ? `${summary.topContainer.matchedLines} matching lines` : 'No recent errors'}
                    </div>
                </div>
            </div>

            <div className='rounded-2xl border border-white/10 bg-login-900/50 p-4'>
                <div className='flex flex-wrap items-center gap-3'>
                    <select
                        value={service}
                        onChange={(event) => setService(event.target.value)}
                        className='h-10 min-w-56 cursor-pointer rounded-xl border border-white/10
                            bg-login-50/5 px-3 text-sm text-login-50 outline-none'
                    >
                        <option value=''>All services</option>
                        {serviceOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder='Search error text'
                        className='h-10 min-w-72 flex-1 rounded-xl border border-white/10
                            bg-login-50/5 px-3 text-sm text-login-50 outline-none'
                    />
                    <Toggle
                        value={viewMode}
                        onChange={(next) => setViewMode(next as ViewMode)}
                        left={{ value: 'compact', text: 'Compact' }}
                        right={{ value: 'expanded', text: 'Expanded' }}
                    />
                    <label className='flex cursor-pointer items-center gap-2 text-sm text-login-100'>
                        <input type='checkbox' checked={live} onChange={() => setLive(prev => !prev)} />
                        Live refresh
                    </label>
                    <button
                        type='button'
                        onClick={() => void refresh()}
                        className={`
                            inline-flex cursor-pointer items-center gap-2 rounded-xl bg-login px-3 py-2
                            text-sm font-medium text-black
                        `}
                    >
                        <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
                {error ? <p className='mt-3 text-sm text-red-300'>{error}</p> : null}
            </div>

            <div className='flex-1 overflow-y-auto'>
                <div className='grid gap-4'>
                    {data.containers.length === 0 ? (
                        <div className='rounded-2xl border border-white/10 bg-login-50/5 p-6 text-sm text-login-100'>
                            No matching error logs right now.
                        </div>
                    ) : null}

                    {data.containers.map((container) => {
                        const expanded = isExpanded(container.id)

                        return (
                            <section
                                key={container.id}
                                className='rounded-2xl border border-white/10 bg-login-900/55'
                            >
                                <div
                                    role='button'
                                    tabIndex={0}
                                    onClick={() => toggleContainer(container.id)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault()
                                            toggleContainer(container.id)
                                        }
                                    }}
                                    aria-expanded={expanded}
                                    aria-label={expanded ? `Collapse ${container.service}` : `Expand ${container.service}`}
                                    className='flex cursor-pointer flex-wrap items-center justify-between gap-3 px-4 py-3'
                                >
                                    <div>
                                        <div className='flex flex-wrap items-center gap-2'>
                                            <h2 className='text-base font-semibold text-login-50'>{container.service}</h2>
                                            <span className='text-xs text-login-200'>{container.name}</span>
                                            <span className='text-xs text-login-200'>{container.status}</span>
                                        </div>
                                        <p className='mt-1 text-xs text-login-200'>
                                            {container.matchedLines} error lines
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-3'>
                                        <div className={`
                                            rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1
                                            text-xs font-semibold text-red-300
                                        `}>
                                            {container.matchedLines}
                                        </div>
                                        <button
                                            type='button'
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                toggleContainer(container.id)
                                            }}
                                            className='flex h-11 w-11 cursor-pointer items-center justify-center rounded-full
                                                border border-login-100/10 bg-login-50/5 text-login-100 transition
                                                hover:border-login-100/20 hover:bg-login-50/10'
                                        >
                                            <ChevronDown className={`h-5 w-5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>
                                </div>

                                {expanded ? (
                                    <div className='max-h-112 overflow-y-auto border-t border-white/10 px-4 py-3 font-mono text-xs'>
                                        {container.entries.map((entry, index) => (
                                            <div
                                                key={`${container.id}-${index}`}
                                                className={`
                                                    grid grid-cols-[max-content_1fr]
                                                    gap-3 border-b border-white/5
                                                    py-2 last:border-b-0
                                                `}
                                            >
                                                <span className='text-login-200/70'>
                                                    {entry.timestamp ? formatRelativeTime(entry.timestamp) : entry.level}
                                                </span>
                                                <span className={entry.isError ? 'text-red-200' : 'text-login-50'}>
                                                    {entry.message}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </section>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
