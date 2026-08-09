import { Users } from 'lucide-react'
import getOrgChart from '@utils/api/authentik/getOrgChart'
import OrgCanvas from '@components/orgChart/orgCanvas'

export const metadata = {
    title: 'Org Chart · QueenBee',
}

export default async function Page() {
    const chart = await getOrgChart()

    return (
        <div className='flex h-full flex-col gap-4'>
            <header className='flex flex-wrap items-end justify-between gap-4'>
                <div className='flex flex-col gap-1'>
                    <h1 className='text-xl font-semibold text-login-50'>Org Chart</h1>
                </div>
                <div className='flex items-center gap-2 rounded-lg bg-login-900 px-4 py-2'>
                    <Users className='h-5 w-5 text-login' />
                    <span className='text-sm text-login-200'>
                        <span className='font-semibold text-login-50'>{chart.activeCount}</span> active members
                    </span>
                </div>
            </header>

            <OrgCanvas chart={chart} className='min-h-0 flex-1' />
        </div>
    )
}
