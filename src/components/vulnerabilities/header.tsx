import type { GetVulnerabilities } from '@utils/api/internal/vulnerabilities/get'
import type { PageClientProps, VulnerabilityPageState } from './types'
import type useExpandedImages from './useExpandedImages'
import type useScanNotice from './useScanNotice'
import type useSortedImages from './useSortedImages'
import SummaryGrid from './summaryGrid'
import ScanToolbar from './scanToolbar'


type Props = Pick<PageClientProps, 'runScanAction'> & Pick<VulnerabilityPageState, 'data'> & {
    isRefreshing: boolean
    notice: ReturnType<typeof useScanNotice>
    refresh: () => Promise<void>
    scanStatus: GetVulnerabilities['scanStatus']
    setPageState: React.Dispatch<React.SetStateAction<VulnerabilityPageState>>
    sorting: ReturnType<typeof useSortedImages>
    expansion: ReturnType<typeof useExpandedImages>
}

export default function VulnerabilityHeader(props: Props) {
    const { notice: noticeState } = props
    const { scanNotice, now } = noticeState

    return (
        <header className='w-full'>
            <SummaryGrid data={props.data} scanStatus={props.scanStatus} notice={scanNotice} now={now} />
            <ScanToolbar {...props} />
        </header>
    )
}
