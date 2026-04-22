import getLogs from '@utils/api/internal/system/getLogs'
import LogsPageClient from './pageClient'

export default async function Page() {
    const data = await getLogs({
        level: 'error',
        tail: 200
    })

    if (typeof data === 'string') {
        return (
            <div className='h-full overflow-hidden flex flex-col'>
                <div className='flex-none'>
                    <h1 className='font-semibold text-lg'>Logs</h1>
                </div>
                <div className='mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200'>
                    {data}
                </div>
            </div>
        )
    }

    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none pb-4'>
                <h1 className='font-semibold text-lg'>Logs</h1>
            </div>
            <LogsPageClient initialData={data} />
        </div>
    )
}
