import LogsPageClient from './pageClient'

export default function Page() {
    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none pb-4'>
                <h1 className='font-semibold text-lg'>Logs</h1>
            </div>
            <LogsPageClient />
        </div>
    )
}
