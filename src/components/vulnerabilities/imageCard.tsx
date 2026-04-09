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
        <section className='w-full rounded-2xl border border-login-100/10 bg-login-900/55 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)]'>
            <ImageSummary image={image} isExpanded={isExpanded} onToggle={onToggle} />
            {isExpanded ? <ImageDetails image={image} /> : null}
        </section>
    )
}
