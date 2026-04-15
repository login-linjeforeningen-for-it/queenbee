import Search from '@components/inputs/search'
import type { GetVulnerabilities } from '@utils/api/internal/vulnerabilities/get'
import type { PageClientProps, VulnerabilityPageState } from './types'
import LayoutToggle from './layoutToggle'
import RunScanButton from './runScanButton'
import SortToggle from './sortToggle'
import type useExpandedImages from './useExpandedImages'
import useRunScan from './useRunScan'
import type useScanNotice from './useScanNotice'
import type useSortedImages from './useSortedImages'

type Props = Pick<PageClientProps, 'runScanAction'> & {
    data: GetVulnerabilities | null
    isRefreshing: boolean
    notice: ReturnType<typeof useScanNotice>
    refresh: () => Promise<void>
    scanStatus: GetVulnerabilities['scanStatus']
    setPageState: React.Dispatch<React.SetStateAction<VulnerabilityPageState>>
    sorting: ReturnType<typeof useSortedImages>
    expansion: ReturnType<typeof useExpandedImages>
}

export default function ScanToolbar(props: Props) {
    const handleRunScan = useRunScan(props)

    return (
        <div className='mt-4 flex gap-3 justify-between'>
            <Search />
            <div className='flex items-center gap-3'>
                <div className='text-sm text-login-200'>
                    Showing {props.sorting.images.length} of {props.data?.images.length || 0} images
                </div>
                <SortToggle
                    sortMode={props.sorting.sortMode}
                    setSortMode={props.sorting.setSortMode}
                />
                <RunScanButton
                    disabled={props.scanStatus.isRunning || props.isRefreshing}
                    isRunning={props.scanStatus.isRunning}
                    onClick={handleRunScan}
                />
                <LayoutToggle
                    areAllExpanded={props.expansion.areAllExpanded}
                    toggleExpandAll={props.expansion.toggleExpandAll}
                />
            </div>
        </div>
    )
}
