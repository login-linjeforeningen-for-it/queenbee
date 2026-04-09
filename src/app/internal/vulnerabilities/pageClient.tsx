'use client'

import Search from '@components/inputs/search'
import type {
    GetVulnerabilities,
    ImageVulnerabilityReport,
    SeverityLevel,
    VulnerabilityDetail,
} from '@utils/api/internal/vulnerabilities/get'
import {
    AlertTriangle,
    Bug,
    ChevronDown,
    CircleAlert,
    Container,
    ExternalLink,
    LayoutGrid,
    Layers3,
    LoaderCircle,
    Play,
    Rows3,
    SearchX,
    ShieldAlert,
    ShieldCheck,
} from 'lucide-react'
import { startTransition, useEffect, useMemo, useState } from 'react'

const severityOrder: SeverityLevel[] = ['critical', 'high', 'medium', 'low', 'unknown']

const severityLabel: Record<SeverityLevel, string> = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    unknown: 'Unknown',
}

const severityClasses: Record<SeverityLevel, string> = {
    critical: 'border-red-400/25 bg-red-500/10 text-red-200',
    high: 'border-orange-400/25 bg-orange-500/10 text-orange-200',
    medium: 'border-amber-400/25 bg-amber-500/10 text-amber-200',
    low: 'border-sky-400/25 bg-sky-500/10 text-sky-200',
    unknown: 'border-login-100/10 bg-login-50/5 text-login-200',
}

type PageClientProps = {
    initialData: GetVulnerabilities | string
    initialQuery: string
    refreshAction: () => Promise<GetVulnerabilities | string>
    runScanAction: () => Promise<{ message: string, status: GetVulnerabilities['scanStatus'] } | string>
}

type VulnerabilityPageState = {
    data: GetVulnerabilities | null
    error: string | null
}

function getFallbackStatus(): GetVulnerabilities['scanStatus'] {
    return {
        isRunning: false,
        startedAt: null,
        finishedAt: null,
        lastSuccessAt: null,
        lastError: null,
        totalImages: null,
        completedImages: 0,
        currentImage: null,
        estimatedCompletionAt: null,
    }
}

function toPageState(payload: GetVulnerabilities | string): VulnerabilityPageState {
    if (!payload || typeof payload === 'string') {
        return {
            data: null,
            error: typeof payload === 'string'
                ? payload
                : 'Failed to load vulnerability report.',
        }
    }

    if (!Array.isArray(payload.images) || !payload.scanStatus) {
        return {
            data: null,
            error: 'The vulnerability API returned an unexpected response.',
        }
    }

    return {
        data: payload,
        error: null,
    }
}

function formatEta(timestamp: string | null) {
    if (!timestamp) {
        return 'Estimating…'
    }

    return new Date(timestamp).toLocaleTimeString('nb-NO', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    })
}

export default function PageClient({
    initialData,
    initialQuery,
    refreshAction,
    runScanAction,
}: PageClientProps) {
    const [{ data, error }, setPageState] = useState<VulnerabilityPageState>(() => toPageState(initialData))
    const [expandedImages, setExpandedImages] = useState<string[]>([])
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [scanMessage, setScanMessage] = useState<string | null>(null)
    const [sortMode, setSortMode] = useState<'impact' | 'alphabetical'>('impact')
    const scanStatus = data?.scanStatus || getFallbackStatus()

    const images = useMemo(() => {
        const filtered = (data?.images || []).filter((img) => {
            if (!initialQuery) {
                return true
            }

            return (
                img.image.toLowerCase().includes(initialQuery) ||
                img.groups.some(group => group.source.toLowerCase().includes(initialQuery)) ||
                img.vulnerabilities.some(v =>
                    v.id.toLowerCase().includes(initialQuery) ||
                    v.title.toLowerCase().includes(initialQuery) ||
                    (v.packageName || '').toLowerCase().includes(initialQuery)
                )
            )
        })

        return filtered.sort((a, b) => {
            if (sortMode === 'alphabetical') {
                return a.image.localeCompare(b.image)
            }

            const impactScore = (image: ImageVulnerabilityReport) => (
                image.severity.critical * 1000 +
                image.severity.high * 100 +
                image.severity.medium * 10 +
                image.severity.low
            )

            return impactScore(b) - impactScore(a) || b.totalVulnerabilities - a.totalVulnerabilities || a.image.localeCompare(b.image)
        })
    }, [data?.images, initialQuery, sortMode])

    const areAllExpanded = useMemo(
        () => images.length > 0 && expandedImages.length === images.length,
        [expandedImages.length, images.length]
    )
    const compactToggleClass = !areAllExpanded
        ? 'bg-login-200 text-login-950 shadow'
        : 'text-login-200 hover:bg-login-50/10 hover:text-login-50'
    const expandedToggleClass = areAllExpanded
        ? 'bg-login-200 text-login-950 shadow'
        : 'text-login-200 hover:bg-login-50/10 hover:text-login-50'
    const impactSortClass = sortMode === 'impact'
        ? 'bg-login-200 text-login-950 shadow'
        : 'text-login-200 hover:bg-login-50/10 hover:text-login-50'
    const alphabeticalSortClass = sortMode === 'alphabetical'
        ? 'bg-login-200 text-login-950 shadow'
        : 'text-login-200 hover:bg-login-50/10 hover:text-login-50'
    const runScanButtonClass = scanStatus.isRunning || isRefreshing
        ? 'cursor-wait border-amber-400/20 bg-amber-500/10 text-amber-200'
        : 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200 hover:border-emerald-300/30 hover:bg-emerald-500/15'

    async function refresh() {
        setIsRefreshing(true)
        const next = await refreshAction()
        const nextState = toPageState(next)
        setPageState(prev => ({
            data: nextState.data ?? prev.data,
            error: nextState.error,
        }))
        setIsRefreshing(false)
    }

    async function handleRunScan() {
        setScanMessage(null)

        const response = await runScanAction()
        if (typeof response === 'string') {
            setScanMessage(response)
            return
        }

        setScanMessage(response.message)
        startTransition(() => {
            setPageState(prev => ({
                ...prev,
                data: prev.data
                    ? {
                        ...prev.data,
                        scanStatus: response.status
                    }
                    : {
                        generatedAt: null,
                        imageCount: 0,
                        images: [],
                        scanStatus: response.status,
                    }
            }))
        })
        void refresh()
    }

    useEffect(() => {
        if (!scanStatus.isRunning) {
            return
        }

        const intervalId = setInterval(() => {
            void refresh()
        }, 3000)

        return () => clearInterval(intervalId)
    }, [scanStatus.isRunning])

    useEffect(() => {
        setExpandedImages(prev => prev.filter(name => images.some(image => image.image === name)))
    }, [images])

    function toggleExpandAll() {
        setExpandedImages(prev => prev.length === images.length ? [] : images.map(image => image.image))
    }

    function toggleImage(imageName: string) {
        setExpandedImages(prev =>
            prev.includes(imageName)
                ? prev.filter(name => name !== imageName)
                : [...prev, imageName]
        )
    }

    return (
        <div className='h-full overflow-y-auto'>
            <div className='flex w-full flex-col gap-4 pb-4'>
                <header
                    className='w-full rounded-2xl border border-login-100/10 bg-login-900/60 p-5
                        shadow-[0_20px_60px_rgba(0,0,0,0.2)]'
                >
                    <div className='flex flex-col gap-4 lg:flex-row lg:justify-between'>
                        <div>
                            <h1 className='font-semibold text-lg text-login-50'>Vulnerabilities</h1>
                            <p className='mt-1 max-w-2xl text-sm text-login-100'>
                                Docker Scout results across active images, with severity rollups and package-level findings.
                            </p>
                        </div>
                        <div className='grid gap-3 sm:grid-cols-2 md:grid-cols-4 md:min-w-120'>
                            <SummaryCard title='Images' value={String(data?.imageCount || 0)} icon={Container} tone='blue' />
                            <SummaryCard
                                title='Status'
                                value={scanStatus.isRunning ? 'Scanning' : 'Idle'}
                                icon={scanStatus.isRunning ? AlertTriangle : ShieldCheck}
                                tone={scanStatus.isRunning ? 'amber' : 'emerald'}
                            />
                            <SummaryCard
                                title='Last Scan'
                                value={scanStatus.finishedAt
                                    ? new Date(scanStatus.finishedAt).toLocaleString('nb-NO')
                                    : 'No completed scan'}
                                icon={Layers3}
                                tone='violet'
                            />
                            <SummaryCard
                                title='Last Error'
                                value={scanStatus.lastError || 'No recent scan error'}
                                icon={scanStatus.lastError ? CircleAlert : ShieldAlert}
                                tone={scanStatus.lastError ? 'rose' : 'slate'}
                            />
                        </div>
                    </div>
                    <div className='mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
                        <Search />
                        <div className='flex items-center gap-3 self-end lg:self-auto'>
                            <div className='text-sm text-login-200'>
                                Showing {images.length} of {data?.images.length || 0} images
                            </div>
                            <div
                                className='flex items-center rounded-full border border-login-100/10
                                    bg-login-50/5 p-1'
                            >
                                <button
                                    type='button'
                                    onClick={() => setSortMode('impact')}
                                    aria-pressed={sortMode === 'impact'}
                                    className={`
                                        rounded-full px-3 py-2 text-sm font-medium transition
                                        ${impactSortClass}
                                    `}
                                >
                                    Impact
                                </button>
                                <button
                                    type='button'
                                    onClick={() => setSortMode('alphabetical')}
                                    aria-pressed={sortMode === 'alphabetical'}
                                    className={`
                                        rounded-full px-3 py-2 text-sm font-medium transition
                                        ${alphabeticalSortClass}
                                    `}
                                >
                                    A-Z
                                </button>
                            </div>
                            <button
                                type='button'
                                onClick={() => {
                                    void handleRunScan()
                                }}
                                disabled={scanStatus.isRunning || isRefreshing}
                                className={`
                                    inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium
                                    transition ${runScanButtonClass}
                                `}
                            >
                                {scanStatus.isRunning || isRefreshing
                                    ? <LoaderCircle className='h-4 w-4 animate-spin' />
                                    : <Play className='h-4 w-4' />}
                                {scanStatus.isRunning ? 'Scanning…' : 'Run scan'}
                            </button>
                            <div
                                className='flex items-center rounded-full border border-login-100/10
                                    bg-login-50/5 p-1'
                            >
                                <button
                                    type='button'
                                    onClick={() => {
                                        if (areAllExpanded) {
                                            toggleExpandAll()
                                        }
                                    }}
                                    aria-label='Compact vulnerability list'
                                    aria-pressed={!areAllExpanded}
                                    className={`
                                        flex h-9 w-9 items-center justify-center rounded-full transition
                                        ${compactToggleClass}
                                    `}
                                >
                                    <Rows3 className='h-4.5 w-4.5' />
                                </button>
                                <button
                                    type='button'
                                    onClick={() => {
                                        if (!areAllExpanded) {
                                            toggleExpandAll()
                                        }
                                    }}
                                    aria-label='Expanded vulnerability cards'
                                    aria-pressed={areAllExpanded}
                                    className={`
                                        flex h-9 w-9 items-center justify-center rounded-full transition
                                        ${expandedToggleClass}
                                    `}
                                >
                                    <LayoutGrid className='h-4.5 w-4.5' />
                                </button>
                            </div>
                        </div>
                    </div>
                    {scanMessage && (
                        <div className='mt-4 rounded-xl border border-login-100/10 bg-login-50/5 px-4 py-3 text-sm text-login-100'>
                            {scanMessage}
                        </div>
                    )}
                    {scanStatus.isRunning && (
                        <div className='mt-4 rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-4'>
                            <div className='flex items-center justify-between gap-4'>
                                <div>
                                    <div className='text-sm font-medium text-amber-200'>
                                        Scanning {scanStatus.currentImage || 'queued image'}…
                                    </div>
                                    <div className='mt-1 text-sm text-amber-100/80'>
                                        {scanStatus.completedImages} of {scanStatus.totalImages ?? '?'} images complete
                                    </div>
                                </div>
                                <div className='text-right text-sm text-amber-100/80'>
                                    <div>ETA</div>
                                    <div className='font-medium text-amber-200'>
                                        {formatEta(scanStatus.estimatedCompletionAt)}
                                    </div>
                                </div>
                            </div>
                            <div className='mt-3 h-2 overflow-hidden rounded-full bg-amber-950/50'>
                                <div
                                    className='h-full rounded-full bg-amber-300 transition-[width] duration-500'
                                    style={{
                                        width: `${scanStatus.totalImages
                                            ? (scanStatus.completedImages / Math.max(scanStatus.totalImages, 1)) * 100
                                            : 0}%`
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </header>

                {error ? (
                    <div className='w-full rounded-2xl border border-login-100/10 bg-login-900/50 px-6 py-10 text-center'>
                        <div
                            className='mx-auto flex h-14 w-14 items-center justify-center rounded-full border
                                border-rose-400/20 bg-rose-500/10 text-rose-300'
                        >
                            <SearchX className='h-7 w-7' />
                        </div>
                        <h2 className='mt-4 font-semibold text-login-50'>Failed to load vulnerability report</h2>
                        <p className='mt-2 text-sm text-login-100'>
                            The page could not read a valid vulnerability payload from the internal API.
                        </p>
                        <div
                            className='mx-auto mt-5 max-w-2xl rounded-xl border border-rose-400/15
                                bg-rose-500/8 px-4 py-3 text-left text-sm text-rose-200'
                        >
                            {error}
                        </div>
                    </div>
                ) : images.length ? (
                    <div className='flex flex-col gap-4'>
                        {images.map((image) => (
                            <ImageCard
                                key={image.image}
                                image={image}
                                isExpanded={expandedImages.includes(image.image)}
                                onToggle={() => toggleImage(image.image)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className='w-full rounded-2xl border border-login-100/10 bg-login-900/50 px-6 py-10 text-center'>
                        <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-login-50/5 text-login'>
                            <Bug className='h-6 w-6' />
                        </div>
                        <h2 className='mt-4 font-semibold text-login-50'>No matches found</h2>
                        <p className='mt-2 text-sm text-login-100'>
                            Try another image, CVE, package, or source search.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

function SummaryCard({
    title,
    value,
    icon: Icon,
    tone,
}: {
    title: string
    value: string
    icon: typeof Container
    tone: 'blue' | 'amber' | 'emerald' | 'violet' | 'rose' | 'slate'
}) {
    const tones = {
        blue: 'border-sky-400/15 bg-sky-500/10 text-sky-200',
        amber: 'border-amber-400/15 bg-amber-500/10 text-amber-200',
        emerald: 'border-emerald-400/15 bg-emerald-500/10 text-emerald-200',
        violet: 'border-violet-400/15 bg-violet-500/10 text-violet-200',
        rose: 'border-rose-400/15 bg-rose-500/10 text-rose-200',
        slate: 'border-login-100/10 bg-login-50/5 text-login-200',
    } as const

    return (
        <div className='rounded-xl border border-login-100/10 bg-login-50/5 p-4'>
            <div className='flex items-center justify-between'>
                <span className='text-xs font-medium uppercase tracking-[0.18em] text-login-200'>{title}</span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${tones[tone]}`}>
                    <Icon className='h-4 w-4' />
                </div>
            </div>
            <div className='mt-3 text-sm font-medium text-login-50'>{value}</div>
        </div>
    )
}

function ImageCard({
    image,
    isExpanded,
    onToggle,
}: {
    image: ImageVulnerabilityReport
    isExpanded: boolean
    onToggle: () => void
}) {
    const topFindings = image.vulnerabilities.slice(0, 20)

    return (
        <section
            className='w-full rounded-2xl border border-login-100/10 bg-login-900/55 p-5
                shadow-[0_20px_60px_rgba(0,0,0,0.2)]'
        >
            <div
                role='button'
                tabIndex={0}
                onClick={onToggle}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onToggle()
                    }
                }}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? `Collapse ${image.image}` : `Expand ${image.image}`}
                className='flex w-full items-center gap-3 text-left'
            >
                <div
                    className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full
                        border border-violet-400/20 bg-linear-to-br from-violet-500/20 to-fuchsia-500/5 text-violet-200'
                >
                    <Container className='h-5 w-5' />
                </div>

                <div className='min-w-0 flex-1 overflow-hidden'>
                    <div className='flex items-center gap-3 overflow-hidden'>
                        <h2 className='truncate font-semibold text-login-50 text-base'>{image.image}</h2>
                        <span className='shrink-0 text-sm text-login-100'>
                            Scanned {new Date(image.scannedAt).toLocaleString('nb-NO')}
                        </span>
                    </div>
                    {image.scanError && (
                        <div className='mt-2 truncate rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200'>
                            {image.scanError}
                        </div>
                    )}
                </div>

                <div className='flex shrink-0 items-center gap-2 overflow-x-auto'>
                    <MiniStat label='Total' value={String(image.totalVulnerabilities)} compact />
                    {severityOrder.map((severity) => (
                        <SeverityPill
                            key={`${image.image}-${severity}`}
                            severity={severity}
                            count={image.severity[severity]}
                            compact
                        />
                    ))}
                    <button
                        type='button'
                        onClick={(event) => {
                            event.stopPropagation()
                            onToggle()
                        }}
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? `Collapse ${image.image}` : `Expand ${image.image}`}
                        className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full
                            border border-login-100/10 bg-login-50/5 text-login-100 transition
                            hover:border-login-100/20 hover:bg-login-50/10'
                    >
                        <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {isExpanded ? (
                <div className='mt-5 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]'>
                    <div className='rounded-xl border border-login-100/10 bg-login-50/5 p-4'>
                        <div className='text-xs font-medium uppercase tracking-[0.18em] text-login-200'>
                            Dependency Breakdown
                        </div>
                        <div className='mt-4 flex flex-col gap-3'>
                            {image.groups.length ? image.groups.map((group) => (
                                <div
                                    key={`${image.image}-${group.source}`}
                                    className='rounded-xl border border-login-100/10 bg-login-900/50 p-4'
                                >
                                    <div className='flex items-start justify-between gap-3'>
                                        <div>
                                            <div className='wrap-break-words font-medium text-login-50'>{group.source}</div>
                                            <div className='mt-1 text-sm text-login-200'>{group.total} findings</div>
                                        </div>
                                    </div>
                                    <div className='mt-3 flex flex-wrap gap-2'>
                                        {severityOrder.map((severity) => (
                                            <InlineSeverityBadge
                                                key={`${group.source}-${severity}`}
                                                severity={severity}
                                                count={group.severity[severity]}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )) : (
                                <div className='rounded-xl border border-login-100/10 bg-login-900/50 px-4 py-6 text-sm text-login-100'>
                                    No dependency grouping available for this image.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='rounded-xl border border-login-100/10 bg-login-50/5 p-4'>
                        <div className='flex items-center justify-between gap-3'>
                            <span className='text-xs font-medium uppercase tracking-[0.18em] text-login-200'>
                                Vulnerability Details
                            </span>
                            <span className='text-xs uppercase tracking-[0.18em] text-login-200'>
                                {image.vulnerabilities.length} findings
                            </span>
                        </div>
                        <div className='mt-4 flex flex-col gap-3'>
                            {topFindings.length ? topFindings.map((vulnerability) => (
                                <VulnerabilityCard
                                    key={`${image.image}-${vulnerability.id}-${vulnerability.packageName || 'pkg'}`}
                                    vulnerability={vulnerability}
                                />
                            )) : (
                                <div className='rounded-xl border border-login-100/10 bg-login-900/50 px-4 py-6 text-sm text-login-100'>
                                    No per-vulnerability details are stored for this image yet. Run a new scan to populate them.
                                </div>
                            )}
                            {image.vulnerabilities.length > topFindings.length && (
                                <div className='rounded-xl border border-login-100/10 bg-login-900/50 px-4 py-3 text-sm text-login-200'>
                                    Showing the first {topFindings.length} findings to keep the page readable.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    )
}

function MiniStat({ label, value, compact = false }: { label: string, value: string, compact?: boolean }) {
    return (
        <div className={`rounded-xl border border-login-100/10 bg-login-50/5 ${compact ? 'px-3 py-2' : 'p-3'}`}>
            <div className='text-[11px] font-medium uppercase tracking-[0.18em] text-login-200'>{label}</div>
            <div className={`${compact ? 'mt-1 text-sm' : 'mt-2 text-lg'} font-semibold text-login-50`}>{value}</div>
        </div>
    )
}

function SeverityPill({
    severity,
    count,
    compact = false,
}: {
    severity: SeverityLevel
    count: number
    compact?: boolean
}) {
    if (count === 0) {
        return null
    }

    return (
        <div className={`rounded-xl border ${compact ? 'px-3 py-2' : 'p-3'} ${severityClasses[severity]}`}>
            <div className='text-[11px] font-medium uppercase tracking-[0.18em]'>{severityLabel[severity]}</div>
            <div className={`${compact ? 'mt-1 text-sm' : 'mt-2 text-lg'} font-semibold`}>{count}</div>
        </div>
    )
}

function InlineSeverityBadge({ severity, count }: { severity: SeverityLevel, count: number }) {
    if (count === 0) {
        return null
    }

    return (
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${severityClasses[severity]}`}>
            {severityLabel[severity]} {count}
        </span>
    )
}

function VulnerabilityCard({ vulnerability }: { vulnerability: VulnerabilityDetail }) {
    return (
        <div className='rounded-xl border border-login-100/10 bg-login-900/50 p-4'>
            <div className='flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between'>
                <div className='min-w-0'>
                    <div className='flex flex-wrap items-center gap-2'>
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${severityClasses[vulnerability.severity]}`}>
                            {severityLabel[vulnerability.severity]}
                        </span>
                        <span className='break-all font-mono text-sm text-login-200'>{vulnerability.id}</span>
                    </div>
                    <h3 className='mt-3 text-base font-semibold text-login-50'>{vulnerability.title}</h3>
                    <p className='mt-2 text-sm text-login-100'>
                        {vulnerability.description || 'No detailed description available for this finding.'}
                    </p>
                </div>
            </div>

            <div className='mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
                <DetailStat label='Package' value={vulnerability.packageName || 'Unknown'} mono />
                <DetailStat label='Type' value={vulnerability.packageType || 'Unknown'} />
                <DetailStat label='Installed' value={vulnerability.installedVersion || 'Unknown'} mono />
                <DetailStat label='Fixed In' value={vulnerability.fixedVersion || 'No fix listed'} mono />
                <DetailStat label='Source' value={vulnerability.source} />
            </div>

            {vulnerability.references.length ? (
                <div className='mt-4 flex flex-wrap gap-2'>
                    {vulnerability.references.map((reference) => (
                        <a
                            key={reference}
                            href={reference}
                            target='_blank'
                            rel='noreferrer'
                            className='inline-flex items-center gap-1 rounded-full border border-sky-400/15
                                bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-200 transition
                                hover:border-sky-300/30 hover:bg-sky-500/15'
                        >
                            Reference
                            <ExternalLink className='h-3.5 w-3.5' />
                        </a>
                    ))}
                </div>
            ) : null}
        </div>
    )
}

function DetailStat({ label, value, mono = false }: { label: string, value: string, mono?: boolean }) {
    return (
        <div className='rounded-xl border border-login-100/10 bg-login-50/5 p-3'>
            <div className='text-[11px] font-medium uppercase tracking-[0.18em] text-login-200'>{label}</div>
            <div className={`mt-2 break-all text-sm text-login-50 ${mono ? 'font-mono' : ''}`}>{value}</div>
        </div>
    )
}
