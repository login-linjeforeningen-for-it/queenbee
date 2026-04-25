import type { ImageVulnerabilityReport } from '@utils/api/internal/vulnerabilities/get'
import { severityOrder } from './constants'
import InlineSeverityBadge from './inlineSeverityBadge'

export default function ImageBreakdown({ image }: { image: ImageVulnerabilityReport }) {
    return (
        <div className='flex flex-col gap-3 py-2'>
            <h3 className='text-xs font-semibold uppercase tracking-[0.15em] text-login-200'>Dependency Breakdown</h3>
            <div className='mt-2 flex flex-col gap-4 border-l-2 border-login-100/10 pl-4 py-1'>
                {image.groups.length ? image.groups.map((group) => (
                    <div
                        key={`${image.image}-${group.source}`}
                        className='flex flex-col gap-1.5'
                    >
                        <div className='flex flex-col gap-2'>
                            <div className='font-semibold text-sm text-login-50 truncate' title={group.source}>
                                {group.source}
                            </div>
                            <div className='flex flex-wrap items-center gap-1.5'>
                                <div className='text-[10px] font-bold uppercase tracking-wider text-white shrink-0 border border-white/10 bg-white/5 px-2 py-0.5 rounded-full'>
                                    {group.total} Total
                                </div>
                                {severityOrder.map((severity) => (
                                    <InlineSeverityBadge
                                        key={`${group.source}-${severity}`}
                                        severity={severity}
                                        count={group.severity[severity]}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className='text-sm text-login-100'>
                        No dependency grouping available for this image.
                    </div>
                )}
            </div>
        </div>
    )
}
