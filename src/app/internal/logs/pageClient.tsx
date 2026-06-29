'use client'

import { useEffect, useMemo, useState } from 'react'
import { Activity, AlertTriangle, Layers3, RefreshCcw, Search, ServerCrash, TerminalSquare } from 'lucide-react'
import { Button, Card, Input, LeftBarPanel, Select, StatCard, Toggle } from 'uibee/components'
import { parseLogsHash } from '@utils/logsNavigation'
import ExpandableCard from '@components/shared/expandableCard'

type LogEntry = {
    fingerprint: string
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

const DEFAULT_LOG_LEVEL: LogLevel = 'error'
const DEFAULT_TAIL = 200
const EMPTY_LOGS_PAYLOAD: LogsPayload = {
    server: 'Loading...',
    checkedAt: '',
    filters: { level: DEFAULT_LOG_LEVEL, tail: DEFAULT_TAIL },
    totalContainers: 0,
    containers: [],
}

function formatRelativeTime(timestamp: string | null) {
    if (!timestamp) return 'Unknown'
    const parsed = new Date(timestamp)
    if (Number.isNaN(parsed.getTime())) return 'Unknown'
    const diffMs = Date.now() - parsed.getTime()
    const seconds = Math.max(0, Math.floor(diffMs / 1000))
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    const restSeconds = seconds % 60
    if (minutes < 60) return restSeconds ? `${minutes}m ${restSeconds}s ago` : `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    const restMinutes = minutes % 60
    return restMinutes ? `${hours}h ${restMinutes}m ago` : `${hours}h ago`
}

function getTimestampMs(timestamp: string | null) {
    if (!timestamp) return 0
    const parsed = new Date(timestamp).getTime()
    return Number.isNaN(parsed) ? 0 : parsed
}

function getLatestEntryTimestamp(entries: LogEntry[]) {
    return entries.reduce((latest, entry) => Math.max(latest, getTimestampMs(entry.timestamp)), 0)
}

function getSourceTone(sourceType: LogContainer['sourceType']) {
    switch (sourceType) {
        case 'deployment': return 'border-cyan-500/20 bg-cyan-500/10 text-cyan-200'
        case 'journal': return 'border-violet-500/20 bg-violet-500/10 text-violet-200'
        case 'file': return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
        case 'history': return 'border-amber-500/20 bg-amber-500/10 text-amber-200'
        default: return 'border-login-100/10 bg-login-50/5 text-login-100'
    }
}

function formatSourceType(sourceType: LogContainer['sourceType']) {
    switch (sourceType) {
        case 'deployment': return 'Deploy'
        case 'journal': return 'Journal'
        case 'file': return 'File'
        case 'history': return 'History'
        default: return 'Container'
    }
}

export default function LogsPageClient({ initialData }: { initialData?: LogsPayload }) {
    const startingData = initialData || EMPTY_LOGS_PAYLOAD
    const [data, setData] = useState<LogsPayload>(startingData)
    const [service, setService] = useState('')
    const [search, setSearch] = useState('')
    const [level, setLevel] = useState<LogLevel>(startingData.filters.level)
    const [live, setLive] = useState(true)
    const [loading, setLoading] = useState(!initialData)
    const [error, setError] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<ViewMode>('compact')
    const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({})
    const [hashTarget, setHashTarget] = useState(() =>
        typeof window === 'undefined' ? null : parseLogsHash(window.location.hash)
    )

    const serviceOptions = useMemo(() =>
        Array.from(new Set(data.containers.map(c => c.service))).sort((a, b) => a.localeCompare(b))
    , [data.containers])

    const groupedServices = useMemo<ServiceGroup[]>(() => {
        const groups = new Map<string, ServiceGroup>()
        data.containers.forEach((container) => {
            const normalized = {
                ...container,
                entries: [...container.entries].sort((l, r) => getTimestampMs(r.timestamp) - getTimestampMs(l.timestamp)),
            }
            const existing = groups.get(container.service)
            if (existing) {
                existing.sources.push(normalized)
                existing.matchedLines += normalized.matchedLines
                return
            }
            groups.set(normalized.service, { service: normalized.service, matchedLines: normalized.matchedLines, sources: [normalized] })
        })
        return Array.from(groups.values())
            .sort((l, r) =>
                Math.max(...r.sources.map(s => getLatestEntryTimestamp(s.entries)))
                - Math.max(...l.sources.map(s => getLatestEntryTimestamp(s.entries)))
                || r.matchedLines - l.matchedLines
                || l.service.localeCompare(r.service)
            )
            .map(group => ({
                ...group,
                sources: group.sources.sort((l, r) =>
                    getLatestEntryTimestamp(r.entries) - getLatestEntryTimestamp(l.entries)
                    || r.matchedLines - l.matchedLines
                    || l.name.localeCompare(r.name)
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
        setExpandedServices(prev => ({ ...prev, [serviceName]: !prev[serviceName] }))
    }

    async function refresh(nextService = service, nextSearch = search, nextLevel = level) {
        setLoading(true)
        setError(null)
        try {
            const params = new URLSearchParams({ level: nextLevel, tail: '200' })
            if (nextService.trim()) params.set('service', nextService.trim())
            if (nextSearch.trim()) params.set('search', nextSearch.trim())
            const response = await fetch(`/api/internal/logs?${params.toString()}`, { cache: 'no-store' })
            const payload = await response.json()
            if (!response.ok) throw new Error(payload.error || 'Failed to load logs')
            setData(payload)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load logs')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (initialData) return
        void refresh('', '', DEFAULT_LOG_LEVEL)
    }, [])

    useEffect(() => {
        if (!live) return
        const timer = setInterval(() => { void refresh() }, 5000)
        return () => clearInterval(timer)
    }, [live, service, search, level])

    useEffect(() => {
        if (typeof window === 'undefined') return
        const updateHashTarget = () => setHashTarget(parseLogsHash(window.location.hash))
        updateHashTarget()
        window.addEventListener('hashchange', updateHashTarget)
        return () => window.removeEventListener('hashchange', updateHashTarget)
    }, [])

    useEffect(() => {
        if (!hashTarget) return
        const targetSource = data.containers.find(c => c.id === hashTarget.sourceId)
        if (!targetSource) return
        setExpandedServices(prev => ({ ...prev, [targetSource.service]: true }))
        const targetElementId = hashTarget.entryFingerprint
            ? `log-entry-${targetSource.id}-${hashTarget.entryFingerprint}`
            : `log-source-${targetSource.id}`
        const timer = window.setTimeout(() => {
            const el = document.getElementById(targetElementId) || document.getElementById(`log-source-${targetSource.id}`)
            el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
        }, 80)
        return () => window.clearTimeout(timer)
    }, [data.containers, hashTarget])

    return (
        <div className='flex h-full flex-col overflow-hidden'>
            <div className='flex-none grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
                <StatCard
                    label={level === 'error' ? 'Error entries' : 'Log entries'}
                    value={String(summary.totalEntries)}
                    icon={AlertTriangle}
                    tone='rose'
                />
                <StatCard
                    label='Server'
                    value={data.server}
                    icon={TerminalSquare}
                    tone='orange'
                />
                <StatCard
                    label='Noisiest service'
                    value={summary.topService?.service || 'Quiet'}
                    icon={ServerCrash}
                    tone='amber'
                />
                <StatCard
                    label='Extra sources'
                    value={String(summary.hostSources)}
                    icon={Layers3}
                    tone='violet'
                />
            </div>

            <div className='flex-none flex flex-wrap items-center gap-3 py-3'>
                <div className='w-56 shrink-0 -mb-4'>
                    <Select
                        name='service'
                        value={service || null}
                        onChange={(value) => {
                            const next = value ? String(value) : ''
                            setService(next)
                            void refresh(next, search, level)
                        }}
                        options={serviceOptions.map(s => ({ value: s, label: s }))}
                        placeholder='All services'
                    />
                </div>
                <div className='min-w-64 flex-1 -mb-4'>
                    <Input
                        name='search'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') void refresh(service, search, level) }}
                        placeholder='Search log text'
                        icon={<Search className='w-5 h-5' />}
                    />
                </div>
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
                <Toggle
                    value={live}
                    onChange={(next) => setLive(next as boolean)}
                    left={{ value: false, text: 'Static' }}
                    right={{ value: true, text: 'Live' }}
                />
                <Button
                    type='button'
                    text='Refresh'
                    icon={<RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />}
                    onClick={() => void refresh()}
                />
            </div>

            {error && (
                <div className='flex-none mb-3 rounded-2xl border border-red-500/20 bg-red-500/8 p-5 text-sm text-red-300'>
                    {error}
                </div>
            )}

            <div className='flex-1 overflow-y-auto'>
                <div className='flex flex-col gap-3'>
                    {groupedServices.length === 0 && (
                        <div className='rounded-lg border border-dashed border-white/8 p-3 text-xs text-login-300'>
                            {level === 'error' ? 'No matching error logs right now.' : 'No matching logs right now.'}
                        </div>
                    )}

                    {groupedServices.map((group) => {
                        const expanded = isExpanded(group.service)
                        const subtitle = `${group.matchedLines} ${level === 'error' ? 'error' : 'matching'} lines · ${group.sources.length} ${group.sources.length === 1 ? 'source' : 'sources'}`

                        return (
                            <ExpandableCard
                                key={group.service}
                                icon={Activity}
                                iconTone='orange'
                                title={group.service}
                                subtitle={subtitle}
                                trailing={
                                    <LeftBarPanel color='border-l-red-500' className='flex items-center gap-2.5 px-2.5 py-1.5'>
                                        <span className='text-sm font-bold text-login-50'>{group.matchedLines}</span>
                                        <span className='text-[10px] font-semibold uppercase tracking-[0.15em] text-login-300'>
                                            {level === 'error' ? 'Errors' : 'Lines'}
                                        </span>
                                    </LeftBarPanel>
                                }
                                isExpanded={expanded}
                                onToggle={() => toggleContainer(group.service)}
                            >
                                <div className='flex flex-col gap-3'>
                                    {group.sources.map((container) => (
                                        <Card key={container.id} className='overflow-hidden'>
                                            <div
                                                id={`log-source-${container.id}`}
                                                className='flex flex-wrap items-center gap-3 border-b border-white/5 px-4 py-3'
                                            >
                                                <div className='min-w-0 flex-1'>
                                                    <div className='flex flex-wrap items-center gap-2'>
                                                        <span className='font-semibold text-login-50'>{container.name}</span>
                                                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getSourceTone(container.sourceType)}`}>
                                                            {formatSourceType(container.sourceType)}
                                                        </span>
                                                    </div>
                                                    <div className='mt-0.5 text-xs text-login-300'>
                                                        {container.status} &middot; {container.matchedLines} matching lines
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='max-h-112 overflow-y-auto px-4 py-3 font-mono text-xs'>
                                                {container.entries.map((entry, index) => (
                                                    <div
                                                        key={`${container.id}-${index}`}
                                                        id={`log-entry-${container.id}-${entry.fingerprint}`}
                                                        className='grid grid-cols-[max-content_1fr] gap-3 border-b border-white/5 py-2 last:border-b-0'
                                                    >
                                                        <span className='text-login-300'>
                                                            {entry.timestamp ? formatRelativeTime(entry.timestamp) : entry.level}
                                                        </span>
                                                        <span className={entry.isError ? 'text-red-200' : 'text-login-50'}>
                                                            {entry.message}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </ExpandableCard>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
