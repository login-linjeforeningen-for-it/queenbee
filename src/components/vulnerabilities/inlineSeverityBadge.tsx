import type { SeverityLevel } from '@utils/api/internal/vulnerabilities/get'
import { severityClasses, severityLabel } from './constants'

export default function InlineSeverityBadge({ severity, count }: { severity: SeverityLevel, count: number }) {
    if (count === 0) return null

    return (
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ${severityClasses[severity]}`}>
            {severityLabel[severity]} {count}
        </span>
    )
}
