import LogsPageClient from './pageClient'
import getLogs from '@utils/api/internal/system/getLogs'

const defaultLogParams = {
    level: 'error',
    tail: 200,
} as const

export default async function Page() {
    const initialLogs = await getLogs(defaultLogParams)

    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none pb-4'>
                <h1 className='font-semibold text-lg'>Logs</h1>
            </div>
            <LogsPageClient initialData={typeof initialLogs === 'string' ? undefined : initialLogs} />
        </div>
    )
}
