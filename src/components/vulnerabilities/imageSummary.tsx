import type { ImageVulnerabilityReport } from '@utils/api/internal/vulnerabilities/get'
import ImageSummaryActions from './imageSummaryActions'
import ImageSummaryInfo from './imageSummaryInfo'

export default function ImageSummary({
    image,
    isExpanded,
    onToggle,
}: {
    image: ImageVulnerabilityReport
    isExpanded: boolean
    onToggle: () => void
}) {
    return (
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
            className='group flex w-full cursor-pointer items-center justify-between gap-4 text-left transition'
        >
            <ImageSummaryInfo image={image} />
            <ImageSummaryActions image={image} isExpanded={isExpanded} onToggle={onToggle} />
        </div>
    )
}
