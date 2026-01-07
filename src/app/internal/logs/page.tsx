import Alert from '@components/alert/alert'
import Search from '@components/inputs/search'

export default async function Page() {
    return (
        <div className='h-full lg:max-w-[calc(100vw-var(--w-sidebar)-2rem)] overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <h1 className='font-semibold text-lg'>Logs</h1>
                <div className='flex items-center justify-between py-3'>
                    <Search />
                </div>
            </div>
            <div className='w-full h-full flex items-center justify-center'>
                <Alert variant='info'>
                    Coming soon
                </Alert>
            </div>
        </div>
    )
}
