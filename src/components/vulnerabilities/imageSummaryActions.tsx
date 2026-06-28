import type { ImageVulnerabilityReport } from '@utils/api/internal/vulnerabilities/get'
import { ChevronDown } from 'lucide-react'
import { severityOrder } from './constants'
import MiniStat from './miniStat'
import { Button, SeverityPill } from 'uibee/components'

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
        <div className='flex shrink-0 items-center gap-4 overflow-x-auto'>
            <MiniStat label='Total' value={String(image.totalVulnerabilities)} compact />
            {severityOrder.map((severity) => (
                <SeverityPill
                    key={`${image.image}-${severity}`}
                    severity={severity}
                    count={image.severity[severity]}
                    compact
                />
            ))}
            <Button
                variant='secondary'
                icon={<ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />}
                onClick={(event) => {
                    event.stopPropagation()
                    onToggle()
                }}
            />
        </div>
    )
}
