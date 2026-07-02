import type { GetVulnerabilities, ImageVulnerabilityReport, SeverityLevel } from '@utils/api/internal/vulnerabilities/get'

export type SortMode = 'impact' | 'alphabetical'

export type ScanNotice = {
    tone: 'info' | 'success' | 'error'
    title: string
    message?: string
    dismissAt: number | null
}

export type VulnerabilityPageState = {
    data: GetVulnerabilities | null
    error: string | null
}

export type PageClientProps = {
    initialData: GetVulnerabilities | string
    initialQuery: string
    refreshAction: () => Promise<GetVulnerabilities | string>
    runScanAction: () => Promise<{ message: string, status: GetVulnerabilities['scanStatus'] } | string>
}

export type ImageList = ImageVulnerabilityReport[]

export const severityOrder: SeverityLevel[] = ['critical', 'high', 'medium', 'low', 'unknown']

export const severityLabel: Record<SeverityLevel, string> = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    unknown: 'Unknown',
}

export const severityClasses: Record<SeverityLevel, string> = {
    critical: 'bg-red-500/10 text-red-300',
    high: 'bg-orange-500/10 text-orange-300',
    medium: 'bg-amber-500/10 text-amber-300',
    low: 'bg-sky-500/10 text-sky-300',
    unknown: 'bg-login-50/5 text-login-200',
}

export const severityBarClasses: Record<SeverityLevel, string> = {
    critical: 'border-l-red-500',
    high: 'border-l-orange-500',
    medium: 'border-l-amber-500',
    low: 'border-l-green-500',
    unknown: 'border-l-login-400',
}
