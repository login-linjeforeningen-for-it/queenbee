import type { ImageVulnerabilityReport } from '@utils/api/internal/vulnerabilities/get'
import { Container } from 'lucide-react'
import { SeverityPill } from 'uibee/components'
import ExpandableCard from '@components/shared/expandableCard'
import ImageBreakdown from './imageBreakdown'
import ImageFindings from './imageFindings'
import { severityOrder } from './types'

export default function ImageCard({
    image,
    isExpanded,
    onToggle,
}: {
    image: ImageVulnerabilityReport
    isExpanded: boolean
    onToggle: () => void
}) {
    const subtitle = image.scanError
        ? <span className='text-rose-300'>{image.scanError}</span>
        : `${image.totalVulnerabilities} findings · ${new Date(image.scannedAt).toLocaleString('nb-NO')}`

    const trailing = (
        <>
            {severityOrder.map((severity) => (
                <SeverityPill
                    key={`${image.image}-${severity}`}
                    severity={severity}
                    count={image.severity[severity]}
                    compact
                />
            ))}
        </>
    )

    return (
        <ExpandableCard
            icon={Container}
            iconTone='orange'
            title={image.image}
            subtitle={subtitle}
            trailing={trailing}
            isExpanded={isExpanded}
            onToggle={onToggle}
        >
            <div className='grid gap-4 xl:grid-cols-[0.85fr_1.15fr]'>
                <ImageBreakdown image={image} />
                <ImageFindings image={image} />
            </div>
        </ExpandableCard>
    )
}
