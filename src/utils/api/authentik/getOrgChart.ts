'use server'

import config from '@config'
import { authentikApiWrapper } from '@utils/apiAuthentik'

export type OrgMember = {
    pk: number
    name: string
    username: string
    email: string
    joined: string
}

export type OrgUnit = {
    name: string
    members: OrgMember[]
    leaderPks: number[]
}

export type OrgChart = {
    activeCount: number
    board: OrgUnit
    fondet: OrgUnit
    hr: OrgUnit
    committees: OrgUnit[]
}

const AKTIV_GROUP = 'Aktiv'
const BOARD = 'Styret'
const LEADERS = ['Leder', 'Nestleder']
const COMMITTEES = ['TekKom', 'EvntKom', 'PR', 'BarKom', 'BedKom', 'CTFkom', 'SATkom']
const FONDET = 'Fondet'
const HR = 'HR'

type AuthentikUser = {
    pk: number
    name: string
    username: string
    email: string
    is_active: boolean
    date_joined?: string
}

type AuthentikGroup = {
    name: string
    users_obj?: AuthentikUser[]
}

async function fetchJoinDates(token: string): Promise<Map<number, string>> {
    const dateByPk = new Map<number, string>()
    for (let page = 1; page <= 20; page += 1) {
        const data = await authentikApiWrapper({ path: `/core/users/?page=${page}&page_size=100`, token })
        for (const user of (data?.results ?? []) as AuthentikUser[]) {
            if (user?.pk != null) dateByPk.set(user.pk, user.date_joined ?? '')
        }
        if (!data?.pagination?.next) break
    }
    return dateByPk
}

export default async function getOrgChart(): Promise<OrgChart> {
    const token = config.authentik.token ?? ''

    const [data, joinDates] = await Promise.all([
        authentikApiWrapper({ path: '/core/groups/?page_size=200', token }),
        fetchJoinDates(token),
    ])

    const groups: AuthentikGroup[] = data?.results ?? []
    const byName = new Map(groups.map(group => [group.name, group]))

    const activeIds = new Set(
        (byName.get(AKTIV_GROUP)?.users_obj ?? [])
            .filter(user => user.is_active)
            .map(user => user.pk)
    )

    const memberPks = (name: string): number[] => [
        ...new Set(
            (byName.get(name)?.users_obj ?? [])
                .filter(user => activeIds.has(user.pk))
                .map(user => user.pk)
        ),
    ]

    const buildMembers = (name: string): OrgMember[] =>
        (byName.get(name)?.users_obj ?? [])
            .filter(user => activeIds.has(user.pk))
            .map(user => ({
                pk: user.pk,
                name: user.name || user.username,
                username: user.username,
                email: user.email,
                joined: joinDates.get(user.pk) ?? '',
            }))
            .sort((a, b) => (a.joined || '9999').localeCompare(b.joined || '9999') || a.name.localeCompare(b.name))

    const leadersFirst = (members: OrgMember[], leaderPks: number[]): OrgMember[] => {
        const leaders = new Set(leaderPks)
        return [...members].sort((a, b) => Number(leaders.has(b.pk)) - Number(leaders.has(a.pk)))
    }

    const boardPks = new Set(memberPks(BOARD))
    const orgLeaderPks = new Set(LEADERS.flatMap(memberPks))

    const boardLeaderPks = memberPks(BOARD).filter(pk => orgLeaderPks.has(pk))
    const board: OrgUnit = {
        name: BOARD,
        members: leadersFirst(buildMembers(BOARD), boardLeaderPks),
        leaderPks: boardLeaderPks,
    }

    const committees: OrgUnit[] = COMMITTEES.map(name => {
        const members = buildMembers(name)
        const boardInCommittee = members.map(m => m.pk).filter(pk => boardPks.has(pk))
        const withoutOrgLeaders = boardInCommittee.filter(pk => !orgLeaderPks.has(pk))
        const leaderPks = withoutOrgLeaders.length > 0 ? withoutOrgLeaders : boardInCommittee
        return {
            name,
            members: leadersFirst(members, leaderPks),
            leaderPks,
        }
    })

    return {
        activeCount: activeIds.size,
        board,
        fondet: { name: FONDET, members: buildMembers(FONDET), leaderPks: [] },
        hr: { name: HR, members: buildMembers(HR), leaderPks: [] },
        committees,
    }
}
