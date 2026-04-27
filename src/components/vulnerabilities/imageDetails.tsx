import type { ImageVulnerabilityReport } from '@utils/api/internal/vulnerabilities/get'
import ImageBreakdown from './imageBreakdown'
import ImageFindings from './imageFindings'
import ImageScannerBreakdown from './imageScannerBreakdown'

export default function ImageDetails({ image }: { image: ImageVulnerabilityReport }) {
    return (
        <div className='mt-5 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]'>
            <div className='flex flex-col gap-4'>
                <ImageScannerBreakdown image={image} />
                <ImageBreakdown image={image} />
            </div>
            <ImageFindings image={image} />
        </div>
    )
}
