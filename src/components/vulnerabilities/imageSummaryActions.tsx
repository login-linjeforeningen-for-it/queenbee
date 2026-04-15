import type { ImageVulnerabilityReport } from '@utils/api/internal/vulnerabilities/get'
import { ChevronDown } from 'lucide-react'
import { severityOrder } from './constants'
import MiniStat from './miniStat'
import { SeverityPill } from 'uibee/components'

export default function ImageSummaryActions({
    image,
    isExpanded,
    onToggle,
}: {
    image: ImageVulnerabilityReport
    isExpanded: boolean
    onToggle: () => void
}) {
    return (
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
    )
}
