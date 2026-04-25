import type { ImageVulnerabilityReport } from '@utils/api/internal/vulnerabilities/get'
import { Container } from 'lucide-react'

export default function ImageSummaryInfo({ image }: { image: ImageVulnerabilityReport }) {
    return (
        <>
            <div
                className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                    bg-login-50/5 text-login-200 transition group-hover:bg-login-50/10'
            >
                <Container className='h-4.5 w-4.5' />
            </div>
            <div className='min-w-0 flex-1 overflow-hidden pr-4'>
                <div className='flex items-baseline gap-3 overflow-hidden'>
                    <h2 className='truncate font-medium text-login-50 text-base group-hover:text-login transition'>{image.image}</h2>
                    <span className='shrink-0 text-xs text-login-100/70'>
                        {new Date(image.scannedAt).toLocaleString('nb-NO')}
                    </span>
                </div>
                {image.scanError && (
                    <div className='mt-2 truncate text-sm text-rose-300'>
                        {image.scanError}
                    </div>
                )}
            </div>
        </>
    )
}
