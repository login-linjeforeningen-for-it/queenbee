import { Crown } from 'lucide-react'
import { Badge } from 'uibee/components'
import { getMemberDirectory, type Member } from '@utils/api/authentik/members'
import ListPage from '@components/table/listPage'
import ManagedTable from '@components/table/managedTable'
import HistoricalSwitch from '@components/inputs/historical'
import UnitBadges from '@components/directory/unitBadges'

export const metadata = {
    title: 'Member Directory · QueenBee',
}

const pageSize = 14

const columns = [
    { key: 'name' },
    { key: 'email' },
    { key: 'units', label: 'Groups', sortable: false },
    { key: 'last_login' },
    { key: 'status', sortable: false },
]

const sortKeys: Record<string, (member: Member) => string> = {
    name: member => member.name,
    email: member => member.email || member.username,
    last_login: member => member.lastLogin ?? '',
}

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const filters = await searchParams
    const search = (filters.q ?? '').toLowerCase()
    const page = Math.max(1, Number(filters.page) || 1)
    const sortKey = sortKeys[filters.column ?? ''] ?? sortKeys.name

    const members = (await getMemberDirectory())
        .filter(member => filters.service === 'true' || !member.isService)
        .filter(member => filters.aktiv !== 'true' || member.inAktiv)
        .filter(member => !search || [member.name, member.username, member.email, ...member.groups]
            .some(value => value.toLowerCase().includes(search)))
        .sort((a, b) => sortKey(a).localeCompare(sortKey(b)) * (filters.order === 'desc' ? -1 : 1))

    const rows = members.slice((page - 1) * pageSize, page * pageSize).map(member => ({
        pk: member.pk,
        name: (
            <span className='flex items-center gap-1.5 whitespace-nowrap'>
                {member.name}
                {member.isBoard && <Crown className='h-3.5 w-3.5 shrink-0 text-login' fill='currentColor' aria-label='Board' />}
            </span>
        ),
        email: member.email || member.username,
        units: <UnitBadges units={member.units} />,
        last_login: member.lastLogin,
        status: member.isActive ? 'Active' : <Badge text='Inactive' variant='danger' />,
    }))

    return (
        <ListPage
            title='Member Directory'
            aside={(
                <div className='flex flex-wrap justify-end gap-4'>
                    <div><HistoricalSwitch name='aktiv' label='Aktiv only' /></div>
                    <div><HistoricalSwitch name='service' label='Service accounts' /></div>
                </div>
            )}
        >
            <ManagedTable
                data={rows}
                columns={columns}
                idKey='pk'
                rawKeys={['name', 'units', 'status']}
                redirectPath='/org/member'
                totalRows={members.length}
                pageSize={pageSize}
            />
        </ListPage>
    )
}
