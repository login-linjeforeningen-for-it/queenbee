import type { GetVulnerabilities } from '@utils/api/internal/vulnerabilities/get'
import type { ScanNotice } from './types'
import { CircleAlert, Container, Layers3, LoaderCircle, ShieldAlert, ShieldCheck } from 'lucide-react'
import { IconBubble, StatCard } from 'uibee/components'
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
            <div className='mt-4 grid md:grid-cols-2 lg:grid-cols-4 gap-3'>
                <StatCard label='Images' value={String(data?.imageCount || 0)} icon={Container} tone='blue' />
                <div className='rounded-xl bg-login-50/5 p-4'>
                    <div className='flex items-center gap-3 mb-3'>
                        <IconBubble icon={statusIcon} tone={statusTone} />
                        <span className='text-sm font-medium text-login-200 capitalize'>Status</span>
                    </div>
                    <div className='text-lg font-semibold text-login-50 truncate' title={statusValue}>
                        {statusValue}
                    </div>
                    {isScanning && (
                        <div className='mt-2 space-y-1.5'>
                            <div className='flex justify-between items-end gap-2'>
                                <div className='text-xs text-login-200 truncate'>
                                    {scanStatus.currentImage || 'Queued image'} (
                                    {scanStatus.completedImages}/{scanStatus.totalImages ?? '?'})
                                </div>
                                <div className='text-[10px] text-login-200/60 shrink-0 tabular-nums'>
                                    {formatEta(scanStatus.estimatedCompletionAt, now)}
                                </div>
                            </div>
                            <div className='h-1 w-full bg-login-700 rounded-full overflow-hidden'>
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
                        <div className='mt-1 text-xs text-login-200 line-clamp-2' title={notice.message}>
                            {notice.message}
                        </div>
                    )}
                </div>
                <StatCard
                    label='Last scan'
                    value={scanStatus.finishedAt
                        ? new Date(scanStatus.finishedAt).toLocaleString('nb-NO')
                        : 'No completed scan'}
                    icon={Layers3}
                    tone='violet'
                />
                <StatCard
                    label='Last error'
                    value={scanStatus.lastError ? 'Failed' : 'None'}
                    icon={scanStatus.lastError ? CircleAlert : ShieldAlert}
                    tone={scanStatus.lastError ? 'rose' : 'slate'}
                />
            </div>
        </div>
    )
}
