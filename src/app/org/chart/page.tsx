import getOrgChart from '@utils/api/authentik/getOrgChart'
import OrgCanvas from '@components/orgChart/orgCanvas'

export const metadata = {
    title: 'Org Chart · QueenBee',
}

export default async function Page() {
    const chart = await getOrgChart()

    return (
        <div className='flex h-full flex-col gap-4'>
            <div className='flex min-h-9 flex-wrap items-center justify-between gap-2'>
                <h1 className='font-semibold text-lg'>Org Chart</h1>
                <span className='text-sm text-login-200'>
                    <span className='font-medium text-login-50'>{chart.activeCount}</span> active members
                </span>
            </div>

            <OrgCanvas chart={chart} className='min-h-0 flex-1' />
        </div>
    )
}
