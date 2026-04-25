import Search from '@components/inputs/search'
import type { GetVulnerabilities } from '@utils/api/internal/vulnerabilities/get'
import type { PageClientProps, VulnerabilityPageState } from './types'
import RunScanButton from './runScanButton'
import type useExpandedImages from './useExpandedImages'
import useRunScan from './useRunScan'
import type useScanNotice from './useScanNotice'
import type useSortedImages from './useSortedImages'
import { Toggle } from 'uibee/components'
import { LayoutGrid, Rows3 } from 'lucide-react'

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
        <div className='flex items-center justify-between gap-3 py-3'>
            <Search
                className='-mb-5'
                innerClassname='w-full min-w-80 max-w-[28rem]'
            />
            <div className='flex shrink-0 items-center gap-2'>
                <div className='mr-2 hidden text-sm text-muted-foreground lg:block'>
                    Showing {props.sorting.images.length} of {props.data?.images.length || 0} images
                </div>
                <Toggle
                    value={props.sorting.sortMode}
                    onChange={props.sorting.setSortMode}
                    left={{ value: 'impact', text: 'Impact' }}
                    right={{ value: 'alphabetical', text: 'A-Z' }}
                />
                <Toggle
                    value={props.expansion.areAllExpanded}
                    onChange={(next) => {
                        if (next !== props.expansion.areAllExpanded) {
                            props.expansion.toggleExpandAll()
                        }
                    }}
                    left={{
                        value: false,
                        icon: <Rows3 className='h-4.5 w-4.5' />,
                        label: 'Compact vulnerability list',
                    }}
                    right={{
                        value: true,
                        icon: <LayoutGrid className='h-4.5 w-4.5' />,
                        label: 'Expanded vulnerability cards',
                    }}
                />
                <RunScanButton
                    disabled={props.scanStatus.isRunning || props.isRefreshing}
                    isRunning={props.scanStatus.isRunning}
                    onClick={handleRunScan}
                />
            </div>
        </div>
    )
}
