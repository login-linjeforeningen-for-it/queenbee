import Link from 'next/link'
import Pulse from './pulse'
import getSegmentedPathname from '@/utils/pathname'
import { headers } from 'next/headers'
import worstAndBestServiceStatus from '../services/worstAndBestServiceStatus'

export default async function Global() {
    const Headers = await headers()
    const path = Headers.get('x-current-path') || ''
    const segmentedPathname = getSegmentedPathname(path)
    const context = segmentedPathname[1] || 'prod'
    const isGlobal = path.includes('global')
    const { meta } = await worstAndBestServiceStatus('prod', true)
    const globalStyles = isGlobal ? 'bg-login-600 text-login-200 cursor-not-allowed' : 'bg-login-500 text-foreground cursor-pointer'

    return (
        <Link
            href={`/internal/kubernetes/${context}/global`}
            className={`rounded-md self-center ${globalStyles} px-2 w-full flex justify-between items-center`}
        >
            Global
            <Pulse
                innerWidth='w-2'
                innerHeight='h-2'
                outerWidth='w-2.5'
                outerHeight='h-2.5'
                status={meta}
            />
        </Link>
    )
}
