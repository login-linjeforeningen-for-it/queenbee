'use client'

import { Calendar, BriefcaseBusiness, Megaphone, Building2, MapPin, Images } from 'lucide-react'
import Stat from './stat'

export default function TotalStats({ stats }: { stats: DashboardTotalStats }) {
    return (
        <div className='mt-4 grid md:grid-cols-2 lg:grid-cols-6 gap-4'>
            <Stat text='events' count={stats.events} item={Calendar} />
            <Stat text='jobs' count={stats.jobs} item={BriefcaseBusiness} />
            <Stat text='announcements' count={stats.announcements} item={Megaphone} />
            <Stat text='organizations' count={stats.organizations} item={Building2} />
            <Stat text='locations' count={stats.locations} item={MapPin} />
            <Stat text='albums' count={stats.albums} item={Images} />
        </div>
    )
}
