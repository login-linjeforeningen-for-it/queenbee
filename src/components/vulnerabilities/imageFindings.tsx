import type { ImageVulnerabilityReport } from '@utils/api/internal/vulnerabilities/get'
import VulnerabilityCard from './vulnerabilityCard'

export default function ImageFindings({ image }: { image: ImageVulnerabilityReport }) {
    const topFindings = image.vulnerabilities.slice(0, 20)

    return (
        <div className='rounded-xl border border-login-100/10 bg-login-50/5 p-4'>
            <div className='flex items-center justify-between gap-3'>
                <span className='text-xs font-medium uppercase tracking-[0.18em] text-login-200'>
                    Vulnerability Details
                </span>
                <span className='text-xs uppercase tracking-[0.18em] text-login-200'>
                    {image.vulnerabilities.length} findings
                </span>
            </div>
            <div className='mt-4 flex flex-col gap-3'>
                {topFindings.length ? topFindings.map((vulnerability) => (
                    <VulnerabilityCard
                        key={`${image.image}-${vulnerability.id}-${vulnerability.packageName || 'pkg'}`}
                        vulnerability={vulnerability}
                    />
                )) : (
                    <div className='rounded-xl border border-login-100/10 bg-login-900/50 px-4 py-6 text-sm text-login-100'>
                        No per-vulnerability details are stored for this image yet. Run a new scan to populate them.
                    </div>
                )}
                {image.vulnerabilities.length > topFindings.length && (
                    <div className='rounded-xl border border-login-100/10 bg-login-900/50 px-4 py-3 text-sm text-login-200'>
                        Showing the first {topFindings.length} findings to keep the page readable.
                    </div>
                )}
            </div>
        </div>
    )
}
