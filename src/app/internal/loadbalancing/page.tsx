import getSites from '@utils/api/beekeeper/loadbalancing/getSites'
import LoadBalancingClient from './pageClient'

export default async function Page() {
    const sites = await getSites()

    if (typeof sites === 'string') {
        return (
            <div className='h-full overflow-hidden flex flex-col'>
                <div className='flex-none'>
                    <h1 className='font-semibold text-lg'>Load Balancing</h1>
                </div>
                <div className='mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200'>
                    {sites}
                </div>
            </div>
        )
    }

    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none pb-4'>
                <h1 className='font-semibold text-lg'>Load Balancing</h1>
            </div>
            <LoadBalancingClient initialSites={sites} />
        </div>
    )
}
