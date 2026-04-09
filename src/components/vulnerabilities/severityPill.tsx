import type { SeverityLevel } from '@utils/api/internal/vulnerabilities/get'
import { severityClasses, severityLabel } from './constants'

export default function SeverityPill({ severity, count, compact = false }: { severity: SeverityLevel, count: number, compact?: boolean }) {
    if (count === 0) return null

    return (
        <div className={`rounded-xl border ${compact ? 'px-3 py-2' : 'p-3'} ${severityClasses[severity]}`}>
            <div className='text-[11px] font-medium uppercase tracking-[0.18em]'>{severityLabel[severity]}</div>
            <div className={`${compact ? 'mt-1 text-sm' : 'mt-2 text-lg'} font-semibold`}>{count}</div>
        </div>
    )
}
