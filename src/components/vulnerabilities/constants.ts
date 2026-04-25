import type { SeverityLevel } from '@utils/api/internal/vulnerabilities/get'

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
