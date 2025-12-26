'use client'

import {
    Calendar,
    BriefcaseBusiness,
    Megaphone,
    Building2,
    MapPin,
    Images
} from 'lucide-react'
import Stat from './stat'

export default function TotalStats({ stats }: { stats: DashboardTotalStats }) {
    return (
        <div className='mt-4 grid grid-cols-2 md:grid-cols-6 gap-4'>
            <Stat text='events' count={stats.events} item={<Calendar className='w-5 h-5' />} />
            <Stat text='jobs' count={stats.jobs} item={<BriefcaseBusiness className='w-5 h-5' />} />
            <Stat text='announcements' count={stats.announcements} item={<Megaphone className='w-5 h-5' />} />
            <Stat text='organizations' count={stats.organizations} item={<Building2 className='w-5 h-5' />} />
            <Stat text='locations' count={stats.locations} item={<MapPin className='w-5 h-5' />} />
            <Stat text='albums' count={stats.albums} item={<Images className='w-5 h-5' />} />
        </div>
    )
}
