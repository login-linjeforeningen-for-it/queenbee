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
    sourceType: 'container' | 'journal' | 'file' | 'history' | 'deployment'
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
type LogLevel = 'all' | 'error'
type ServiceGroup = {
    service: string
    matchedLines: number
    sources: LogContainer[]
}

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
    const [level, setLevel] = useState<LogLevel>(initialData.filters.level)
    const [live, setLive] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<ViewMode>('compact')
    const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({})

    const serviceOptions = useMemo(() =>
        Array.from(new Set(data.containers.map(container => container.service))).sort((a, b) => a.localeCompare(b))
    , [data.containers])

    const groupedServices = useMemo<ServiceGroup[]>(() => {
        const groups = new Map<string, ServiceGroup>()

        data.containers.forEach((container) => {
            const existing = groups.get(container.service)
            if (existing) {
                existing.sources.push(container)
                existing.matchedLines += container.matchedLines
                return
            }

            groups.set(container.service, {
                service: container.service,
                matchedLines: container.matchedLines,
                sources: [container],
            })
        })

        return Array.from(groups.values())
            .sort((left, right) =>
                right.matchedLines - left.matchedLines
                || left.service.localeCompare(right.service)
            )
            .map(group => ({
                ...group,
                sources: group.sources.sort((left, right) =>
                    right.matchedLines - left.matchedLines
                    || left.name.localeCompare(right.name)
                ),
            }))
    }, [data.containers])

    const summary = useMemo(() => {
        const totalEntries = data.containers.reduce((sum, item) => sum + item.matchedLines, 0)
        const topService = groupedServices[0] || null
        const hostSources = data.containers.filter(item => item.sourceType !== 'container').length
        return { totalEntries, topService, hostSources }
    }, [data, groupedServices])

    function isExpanded(serviceName: string) {
        return viewMode === 'expanded' || Boolean(expandedServices[serviceName])
    }

    function toggleContainer(serviceName: string) {
        setExpandedServices((prev) => ({
            ...prev,
            [serviceName]: !prev[serviceName],
        }))
    }

    async function refresh(nextService = service, nextSearch = search, nextLevel = level) {
        setLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams({
                level: nextLevel,
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
    }, [live, service, search, level])

    function getSourceTone(sourceType: LogContainer['sourceType']) {
        switch (sourceType) {
        case 'deployment':
            return 'border-cyan-500/20 bg-cyan-500/10 text-cyan-200'
        case 'journal':
            return 'border-violet-500/20 bg-violet-500/10 text-violet-200'
        case 'file':
            return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
        case 'history':
            return 'border-amber-500/20 bg-amber-500/10 text-amber-200'
        default:
            return 'border-login-100/10 bg-login-50/5 text-login-100'
        }
    }

    function formatSourceType(sourceType: LogContainer['sourceType']) {
        switch (sourceType) {
        case 'deployment':
            return 'Deploy'
        case 'journal':
            return 'Journal'
        case 'file':
            return 'File'
        case 'history':
            return 'History'
        default:
            return 'Container'
        }
    }

    return (
        <div className='flex h-full flex-col gap-4 overflow-hidden'>
            <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
                <div className='rounded-2xl border border-white/10 bg-login-50/5 p-4'>
                    <div className='flex items-center gap-2 text-login-200'>
                        <AlertTriangle className='h-4 w-4 text-red-400' />
                        {level === 'error' ? 'Error entries' : 'Log entries'}
                    </div>
                    <div className='mt-3 text-3xl font-semibold text-login-50'>{summary.totalEntries}</div>
                    <div className='mt-1 text-xs text-login-200'>
                        {level === 'error' ? 'Focused on recent error logs only' : 'Showing recent log activity across sources'}
                    </div>
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
                        {summary.topService?.service || 'Quiet'}
                    </div>
                    <div className='mt-1 text-xs text-login-200'>
                        {summary.topService ? `${summary.topService.matchedLines} matching lines` : 'No recent matches'}
                    </div>
                </div>
                <div className='rounded-2xl border border-white/10 bg-login-50/5 p-4'>
                    <div className='flex items-center gap-2 text-login-200'>
                        <ServerCrash className='h-4 w-4 text-amber-400' />
                        Extra sources
                    </div>
                    <div className='mt-3 text-xl font-semibold text-login-50'>
                        {summary.hostSources}
                    </div>
                    <div className='mt-1 text-xs text-login-200'>
                        Host, journal, deploy, and shell sources mixed into the stream
                    </div>
                </div>
            </div>

            <div className='rounded-2xl border border-white/10 bg-login-900/50 p-4'>
                <div className='flex flex-wrap items-center gap-3 xl:flex-nowrap'>
                    <select
                        value={service}
                        onChange={(event) => {
                            const nextService = event.target.value
                            setService(nextService)
                            void refresh(nextService, search, level)
                        }}
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
                        placeholder='Search log text'
                        className='h-10 min-w-72 flex-1 rounded-xl border border-white/10
                            bg-login-50/5 px-3 text-sm text-login-50 outline-none'
                    />
                    <Toggle
                        value={level}
                        onChange={(next) => {
                            const nextLevel = next as LogLevel
                            setLevel(nextLevel)
                            void refresh(service, search, nextLevel)
                        }}
                        left={{ value: 'error', text: 'Errors' }}
                        right={{ value: 'all', text: 'All logs' }}
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
                    {groupedServices.length === 0 ? (
                        <div className='rounded-2xl border border-white/10 bg-login-50/5 p-6 text-sm text-login-100'>
                            {level === 'error' ? 'No matching error logs right now.' : 'No matching logs right now.'}
                        </div>
                    ) : null}

                    {groupedServices.map((group) => {
                        const expanded = isExpanded(group.service)

                        return (
                            <section
                                key={group.service}
                                className='rounded-2xl border border-white/10 bg-login-900/55'
                            >
                                <div
                                    role='button'
                                    tabIndex={0}
                                    onClick={() => toggleContainer(group.service)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault()
                                            toggleContainer(group.service)
                                        }
                                    }}
                                    aria-expanded={expanded}
                                    aria-label={expanded ? `Collapse ${group.service}` : `Expand ${group.service}`}
                                    className='flex cursor-pointer flex-wrap items-center justify-between gap-3 px-4 py-3'
                                >
                                    <div>
                                        <div className='flex flex-wrap items-center gap-2'>
                                            <h2 className='text-base font-semibold text-login-50'>{group.service}</h2>
                                            <span className='text-xs text-login-200'>
                                                {group.sources.length} {group.sources.length === 1 ? 'source' : 'sources'}
                                            </span>
                                        </div>
                                        <p className='mt-1 text-xs text-login-200'>
                                            {group.matchedLines} error lines
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-3'>
                                        <div className={`
                                            rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1
                                            text-xs font-semibold text-red-300
                                        `}>
                                            {group.matchedLines}
                                        </div>
                                        <button
                                            type='button'
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                toggleContainer(group.service)
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
                                    <div className='border-t border-white/10 px-4 py-3'>
                                        <div className='grid gap-4'>
                                            {group.sources.map((container) => (
                                                <div
                                                    key={container.id}
                                                    className='overflow-hidden rounded-2xl border border-white/10 bg-black/10'
                                                >
                                                    <div className={`
                                                        flex flex-wrap items-center 
                                                        justify-between gap-3 border-b
                                                        border-white/10 px-4 py-3
                                                    `}>
                                                        <div>
                                                            <div className='flex flex-wrap items-center gap-2'>
                                                                <div className='text-sm font-semibold text-login-50'>
                                                                    {container.name}
                                                                </div>
                                                                <span className={`
                                                                    rounded-full border px-2 py-1 text-[10px] font-semibold
                                                                    uppercase tracking-[0.14em] ${getSourceTone(container.sourceType)}
                                                                `}>
                                                                    {formatSourceType(container.sourceType)}
                                                                </span>
                                                            </div>
                                                            <div className='mt-1 flex flex-wrap items-center gap-2 text-xs text-login-200'>
                                                                <span>{container.status}</span>
                                                                <span>{container.matchedLines} matching lines</span>
                                                                <span>{container.service}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='max-h-112 overflow-y-auto px-4 py-3 font-mono text-xs'>
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
                                                </div>
                                            ))}
                                        </div>
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
