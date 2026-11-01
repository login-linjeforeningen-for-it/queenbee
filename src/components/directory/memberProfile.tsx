import { Crown, ExternalLink } from 'lucide-react'
import { Badge, Card } from 'uibee/components'
import BackButton from '@components/navigation/back'
import type { Member as Profile } from '@utils/api/authentik/members'
import { REMOVABLE_GROUPS } from '@utils/api/authentik/orgGroups'

const MANAGED_GROUP_SET = new Set(REMOVABLE_GROUPS)

function fmtDate(iso: string | null) {
    if (!iso) return 'Never'
    return new Date(iso).toISOString().slice(0, 10)
}

function initials(name: string) {
    return name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join('') || '?'
}

function Stat({ label, value }: { label: string, value: string }) {
    return (
        <div className='flex min-w-0 flex-col gap-1'>
            <span className='text-sm text-login-200'>{label}</span>
            <span className='truncate text-sm font-medium text-login-50' title={value}>{value}</span>
        </div>
    )
}

export default function MemberProfile({ profile, authentikUrl }: { profile: Profile, authentikUrl: string }) {
    // Aktiv, committees and roles are shown (and managed) by the membership panel
    // below, so only surface groups it does not already cover to avoid repeats.
    const otherGroups = profile.groups.filter(group => !MANAGED_GROUP_SET.has(group))
    const hasBadges = profile.inAktiv || profile.isBoard || profile.isSuperuser || profile.isService || !profile.isActive

    return (
        <div className='flex flex-col gap-6'>
            <BackButton pushURL='/org/directory' />

            <div className='flex flex-wrap items-center justify-between gap-4'>
                <div className='flex min-w-0 items-center gap-4'>
                    {profile.avatar ? (
                        <img src={profile.avatar} alt='' className='h-12 w-12 rounded-full object-cover' />
                    ) : (
                        <span className={
                            'flex h-12 w-12 min-w-12 items-center justify-center rounded-full bg-login-500 font-medium text-login-100'
                        }>
                            {initials(profile.name)}
                        </span>
                    )}
                    <div className='flex min-w-0 flex-col'>
                        <h1 className='flex items-center gap-2 truncate text-lg font-semibold'>
                            {profile.name}
                            {profile.isBoard && <Crown className='h-4 w-4 shrink-0 text-login' fill='currentColor' aria-label='Board' />}
                        </h1>
                        <span className='text-sm text-login-200'>@{profile.username}</span>
                    </div>
                </div>
                <a
                    href={`${authentikUrl}/if/admin/#/identity/users/${profile.pk}`}
                    target='_blank'
                    rel='noreferrer'
                    className={`
                        flex h-9 items-center gap-2 rounded-md bg-login-500 px-4 text-sm font-medium text-login-50
                        transition-colors hover:bg-login-400 focus-visible:outline-2 focus-visible:outline-offset-2
                        focus-visible:outline-login
                    `}
                >
                    <ExternalLink className='h-4 w-4' /> Open in Authentik
                </a>
            </div>

            {hasBadges && (
                <div className='flex flex-wrap gap-2'>
                    {profile.inAktiv && <Badge text='Active member' variant='orange' />}
                    {profile.isBoard && <Badge text='Board' variant='orange' />}
                    {profile.isSuperuser && <Badge text='Superuser' variant='violet' />}
                    {profile.isService && <Badge text='Service account' variant='default' />}
                    {!profile.isActive && <Badge text='Inactive' variant='danger' />}
                </div>
            )}

            <Card className='grid grid-cols-2 gap-x-6 gap-y-4 p-4 sm:grid-cols-4'>
                <Stat label='Email' value={profile.email || 'Not set'} />
                <Stat label='Account created' value={fmtDate(profile.joined)} />
                <Stat label='Last login' value={fmtDate(profile.lastLogin)} />
                <Stat label='Status' value={profile.isActive ? 'Active' : 'Deactivated'} />
            </Card>

            {otherGroups.length > 0 && (
                <section className='flex flex-col gap-3'>
                    <h2 className='font-semibold text-lg'>Other groups</h2>
                    <div className='flex flex-wrap gap-1.5'>
                        {otherGroups.map(group => <Badge key={group} text={group} variant='default' />)}
                    </div>
                </section>
            )}
        </div>
    )
}
