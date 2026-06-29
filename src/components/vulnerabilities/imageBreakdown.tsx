import type { ImageVulnerabilityReport } from '@utils/api/internal/vulnerabilities/get'
import { Layers } from 'lucide-react'
import { LeftBarPanel, SeverityPill } from 'uibee/components'
import { severityOrder } from './constants'

export default function ImageBreakdown({ image }: { image: ImageVulnerabilityReport }) {
    return (
        <div className='flex flex-col gap-3 py-2'>
            <div className='mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-login-300'>
                <Layers className='h-3.5 w-3.5' />
                Dependency Breakdown
            </div>
            <div className='flex flex-col gap-4'>
                {image.groups.length ? image.groups.map((group) => (
                    <div
                        key={`${image.image}-${group.source}`}
                        className='flex flex-col gap-1.5'
                    >
                        <div className='font-semibold text-sm text-login-50 truncate' title={group.source}>
                            {group.source}
                        </div>
                        <div className='flex flex-wrap items-center gap-1.5'>
                            <LeftBarPanel color='bg-login-50/5 text-login-200' className='flex items-center gap-2.5 px-2.5 py-1.5'>
                                <span className='text-sm font-bold text-login-50'>{group.total}</span>
                                <span className='text-[10px] font-semibold uppercase tracking-[0.15em] text-login-300'>Total</span>
                            </LeftBarPanel>
                            {severityOrder.map((severity) => (
                                <SeverityPill
                                    key={`${group.source}-${severity}`}
                                    severity={severity}
                                    count={group.severity[severity]}
                                    compact
                                />
                            ))}
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
