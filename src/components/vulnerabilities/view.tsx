import type { GetVulnerabilities } from '@utils/api/internal/vulnerabilities/get'
import type { PageClientProps, VulnerabilityPageState } from './types'
import type useExpandedImages from './useExpandedImages'
import type useScanNotice from './useScanNotice'
import type useSortedImages from './useSortedImages'
import VulnerabilityHeader from './header'
import ErrorState from './errorState'
import EmptyState from './emptyState'
import VulnerabilityList from './vulnerabilityList'

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
    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <VulnerabilityHeader {...props} />
            </div>
            <div className='flex-1 overflow-y-auto pb-6'>
                {props.error
                    ? <ErrorState error={props.error} />
                    : props.sorting.images.length
                        ? <VulnerabilityList images={props.sorting.images} expansion={props.expansion} />
                        : <EmptyState />}
            </div>
        </div>
    )
}
