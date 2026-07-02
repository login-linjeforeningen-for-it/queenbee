import { Bug, SearchX } from 'lucide-react'
import type { GetVulnerabilities } from '@utils/api/internal/vulnerabilities/get'
import type { PageClientProps, VulnerabilityPageState } from './types'
import type useExpandedImages from './useExpandedImages'
import type useScanNotice from './useScanNotice'
import type useSortedImages from './useSortedImages'
import SummaryGrid from './summaryGrid'
import ScanToolbar from './scanToolbar'
import ImageCard from './imageCard'

type Props = Pick<PageClientProps, 'runScanAction'> & Pick<VulnerabilityPageState, 'data' | 'error'> & {
    isRefreshing: boolean
    notice: ReturnType<typeof useScanNotice>
    refresh: () => Promise<void>
    scanStatus: GetVulnerabilities['scanStatus']
    setPageState: React.Dispatch<React.SetStateAction<VulnerabilityPageState>>
    sorting: ReturnType<typeof useSortedImages>
    expansion: ReturnType<typeof useExpandedImages>
}

export default function VulnerabilityView(props: Props) {
    const { scanNotice, now } = props.notice
    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <header className='w-full'>
                    <SummaryGrid data={props.data} scanStatus={props.scanStatus} notice={scanNotice} now={now} />
                    <ScanToolbar {...props} />
                </header>
            </div>
            <div className='flex-1 overflow-y-auto pb-6'>
                {props.error ? (
                    <div className='w-full py-16 text-center flex flex-col items-center justify-center opacity-80'>
                        <SearchX className='h-8 w-8 text-rose-300 mb-4' />
                        <h2 className='font-semibold text-login-50'>Failed to load vulnerability report</h2>
                        <p className='mt-1 text-sm text-login-100 max-w-sm'>
                            The page could not read a valid vulnerability payload from the internal API.
                        </p>
                        <div className='mt-6 text-sm text-rose-300 max-w-xl text-left'>
                            <code>{props.error}</code>
                        </div>
                    </div>
                ) : props.sorting.images.length ? (
                    <div className='flex flex-col gap-4'>
                        {props.sorting.images.map((image) => (
                            <ImageCard
                                key={image.image}
                                image={image}
                                isExpanded={props.expansion.expandedImages.includes(image.image)}
                                onToggle={() => props.expansion.toggleImage(image.image)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className='w-full py-16 text-center flex flex-col items-center justify-center opacity-60'>
                        <Bug className='h-8 w-8 text-login-200 mb-4' />
                        <h2 className='font-semibold text-login-50'>No matches found</h2>
                        <p className='mt-1 text-sm text-login-100 max-w-sm'>Try another image, CVE, package, or source search.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
