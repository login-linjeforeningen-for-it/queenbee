import type { ImageVulnerabilityReport } from '@utils/api/internal/vulnerabilities/get'
import { SeverityPill } from 'uibee/components'
import { severityOrder } from './constants'
import { scannerLabel } from './scannerMeta'

export default function ImageScannerBreakdown({ image }: { image: ImageVulnerabilityReport }) {
    return (
        <div className='flex flex-col gap-3 py-2'>
            <h3 className='text-xs font-semibold uppercase tracking-[0.15em] text-login-200'>Scanner Coverage</h3>
            <div className='grid gap-3 md:grid-cols-2'>
                {image.scannerResults.map((result) => (
                    <div
                        key={`${image.image}-${result.scanner}`}
                        className='rounded-xl border border-white/8 bg-white/3 px-4 py-3'
                    >
                        <div className='flex items-center justify-between gap-3'>
                            <div>
                                <div className='text-sm font-semibold text-login-50'>{scannerLabel[result.scanner]}</div>
                                <div className='text-xs text-login-100/70'>
                                    {new Date(result.scannedAt).toLocaleString('nb-NO')}
                                </div>
                            </div>
                            <div className='rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-login-50'>
                                {result.totalVulnerabilities} findings
                            </div>
                        </div>
                        <div className='mt-3 flex flex-wrap gap-1.5'>
                            {severityOrder.map((severity) => (
                                <SeverityPill
                                    key={`${result.scanner}-${severity}`}
                                    severity={severity}
                                    count={result.severity[severity]}
                                    compact
                                />
                            ))}
                        </div>
                        {result.note ? (
                            <div className='mt-3 text-xs text-login-100/60'>
                                {result.note}
                            </div>
                        ) : null}
                        {result.scanError ? (
                            <div className='mt-3 rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs text-rose-200'>
                                {result.scanError}
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    )
}
