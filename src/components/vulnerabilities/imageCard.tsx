import type { ImageVulnerabilityReport } from '@utils/api/internal/vulnerabilities/get'
import ImageDetails from './imageDetails'
import ImageSummary from './imageSummary'

export default function ImageCard({
    image,
    isExpanded,
    onToggle,
}: {
    image: ImageVulnerabilityReport
    isExpanded: boolean
    onToggle: () => void
}) {
    return (
        <section className='w-full bg-login-50/5 border border-white/5 rounded-xl px-6 py-5'>
            <ImageSummary image={image} isExpanded={isExpanded} onToggle={onToggle} />
            {isExpanded ? <ImageDetails image={image} /> : null}
        </section>
    )
}
