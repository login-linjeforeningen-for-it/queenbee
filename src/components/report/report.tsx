'use client'

import { TriangleAlert, Users } from 'lucide-react'
import { Badge, StatCard } from 'uibee/components'
import ManagedTable from '@components/table/managedTable'
import UnitBadges from '@components/directory/unitBadges'
import type { MemberReport, ReportMember } from '@utils/api/authentik/getMemberReport'

type Finding = {
    key: string
    title: string
    description: string
    members: ReportMember[]
    showLastLogin?: boolean
}

const columns = [
    { key: 'name' },
    { key: 'email' },
    { key: 'units', label: 'Groups' },
]

function fmtDate(iso: string | null) {
    if (!iso) return 'never'
    return new Date(iso).toISOString().slice(0, 10)
}

function FindingSection({ finding }: { finding: Finding }) {
    const rows = finding.members.map(member => ({
        pk: member.pk,
        name: member.name,
        email: member.email || member.username,
        units: <UnitBadges units={member.units} />,
        last_login: member.lastLogin,
    }))

    return (
        <section className='flex flex-col gap-3'>
            <div>
                <h2 className='font-semibold text-lg'>
                    {finding.title} <span className='font-normal text-login-200'>({finding.members.length})</span>
                </h2>
                <p className='text-sm text-login-200'>{finding.description}</p>
            </div>
            {rows.length === 0 ? (
                <p className='rounded-lg border border-login-600 bg-login-500/50 px-6 py-4 text-sm text-login-200'>Nothing flagged.</p>
            ) : (
                <ManagedTable
                    data={rows}
                    columns={finding.showLastLogin ? [...columns, { key: 'last_login' }] : columns}
                    idKey='pk'
                    rawKeys={['units']}
                    redirectPath='/org/member'
                    hidePagination
                />
            )}
        </section>
    )
}

function StructureList({ label, names, emptyLabel }: { label: string, names: string[], emptyLabel: string }) {
    return (
        <div className='flex flex-col gap-2'>
            <span className='text-sm font-medium text-login-50'>{label}</span>
            {names.length === 0 ? (
                <span className='text-sm text-login-200'>{emptyLabel}</span>
            ) : (
                <div className='flex flex-wrap gap-1.5'>
                    {names.map(name => <Badge key={name} text={name} variant='default' />)}
                </div>
            )}
        </div>
    )
}

export default function Report({ report }: { report: MemberReport }) {
    const findings: Finding[] = [
        {
            key: 'notInAktiv',
            title: 'In a unit but not in Aktiv',
            description: 'Members of a committee or the board that are missing from the Aktiv group.',
            members: report.notInAktiv,
        },
        {
            key: 'unplacedActive',
            title: 'In Aktiv but no committee',
            description: 'Marked active but not placed in any committee or on the board.',
            members: report.unplacedActive,
        },
        {
            key: 'dormant',
            title: `Dormant (${report.dormantMonths}+ months no login)`,
            description: 'Active members who have not logged in recently, candidates for offboarding.',
            members: report.dormant,
            showLastLogin: true,
        },
        {
            key: 'inactiveAccounts',
            title: 'Deactivated accounts still in a group',
            description: 'Accounts marked inactive that still hold membership in an org group.',
            members: report.inactiveAccounts,
        },
    ]

    const totalFlags = findings.reduce((sum, finding) => sum + finding.members.length, 0)

    return (
        <div className='flex flex-col gap-8 pb-8'>
            <div className='flex flex-col gap-4'>
                <div className='flex min-h-9 flex-wrap items-center justify-between gap-2'>
                    <h1 className='font-semibold text-lg'>Member Report</h1>
                    <span className='text-sm text-login-200'>Generated {fmtDate(report.generatedAt)}</span>
                </div>
                <div className='grid grid-cols-2 gap-4 lg:max-w-1/2'>
                    <StatCard label='Active members' value={String(report.activeCount)} icon={Users} />
                    <StatCard
                        label='Flags'
                        value={String(totalFlags)}
                        icon={TriangleAlert}
                        tone={totalFlags === 0 ? 'emerald' : 'amber'}
                    />
                </div>
            </div>

            <div className='grid grid-cols-1 items-start gap-8 xl:grid-cols-2'>
                {findings.map(finding => <FindingSection key={finding.key} finding={finding} />)}
            </div>

            <section className='flex flex-col gap-3'>
                <h2 className='font-semibold text-lg'>Structure</h2>
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                    <StructureList
                        label='Committees without a leader'
                        names={report.committeesWithoutLeader}
                        emptyLabel='All committees have a board leader.'
                    />
                    <StructureList
                        label='Empty groups'
                        names={report.emptyUnits}
                        emptyLabel='No empty org groups.'
                    />
                </div>
            </section>
        </div>
    )
}
