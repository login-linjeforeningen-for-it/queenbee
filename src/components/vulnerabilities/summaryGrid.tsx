import type { GetVulnerabilities } from '@utils/api/internal/vulnerabilities/get'
import type { ScanNotice } from './types'
import { CircleAlert, Container, Layers3, LoaderCircle, ShieldAlert, ShieldCheck } from 'lucide-react'
import SummaryCard from './summaryCard'
import { formatEta } from './helpers'

export default function SummaryGrid({
    data,
    scanStatus,
    notice,
    now,
}: {
    data: GetVulnerabilities | null
    scanStatus: GetVulnerabilities['scanStatus']
    notice: ScanNotice | null
    now: number
}) {
    const isScanning = scanStatus.isRunning
    const statusTone = isScanning
        ? 'amber'
        : (notice?.tone === 'error' ? 'rose' : 'emerald')
    const statusIcon = isScanning
        ? LoaderCircle
        : (notice?.tone === 'error' ? CircleAlert : ShieldCheck)
    const statusValue = isScanning ? 'Scanning' : (notice ? notice.title : 'Idle')

    return (
        <div className='flex-none'>
            <div className='flex flex-row justify-between'>
                <h1 className='font-semibold text-lg'>Vulnerabilities</h1>
            </div>
            <div className='mt-4 grid md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <SummaryCard title='images' value={String(data?.imageCount || 0)} icon={Container} tone='blue' />
                <SummaryCard
                    title='status'
                    value={statusValue}
                    icon={statusIcon}
                    tone={statusTone}
                >
                    {isScanning && (
                        <div className='mt-2 space-y-1.5'>
                            <div className='flex justify-between items-end gap-2'>
                                <div className='text-xs text-muted-foreground truncate'>
                                    {scanStatus.currentImage || 'Queued image'} (
                                    {scanStatus.completedImages}/{scanStatus.totalImages ?? '?'})
                                </div>
                                <div className='text-[10px] text-muted-foreground/60 shrink-0 tabular-nums'>
                                    {formatEta(scanStatus.estimatedCompletionAt, now)}
                                </div>
                            </div>
                            <div className='h-1 w-full bg-white/5 rounded-full overflow-hidden'>
                                <div
                                    className='h-full bg-amber-500 transition-[width] duration-500'
                                    style={{
                                        width: `${scanStatus.totalImages
                                            ? (scanStatus.completedImages / Math.max(scanStatus.totalImages, 1)) * 100
                                            : 0}%`
                                    }}
                                />
                            </div>
                        </div>
                    )}
                    {!isScanning && notice?.message && (
                        <div className='mt-1 text-xs text-muted-foreground line-clamp-2' title={notice.message}>
                            {notice.message}
                        </div>
                    )}
                </SummaryCard>
                <SummaryCard
                    title='last scan'
                    value={scanStatus.finishedAt
                        ? new Date(scanStatus.finishedAt).toLocaleString('nb-NO')
                        : 'No completed scan'}
                    icon={Layers3}
                    tone='violet'
                />
                <SummaryCard
                    title='last error'
                    value={scanStatus.lastError ? 'Failed' : 'None'}
                    icon={scanStatus.lastError ? CircleAlert : ShieldAlert}
                    tone={scanStatus.lastError ? 'rose' : 'slate'}
                />
            </div>
        </div>
    )
}
