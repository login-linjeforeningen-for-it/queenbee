'use client'

import {
    Calendar,
    BriefcaseBusiness,
    Megaphone,
    Building2,
    MapPin
} from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'

export default function TotalStats({ stats }: { stats: DashboardTotalStats }) {
    return (
        <div className='mt-4 grid grid-cols-2 md:grid-cols-5 gap-4'>
            <Stat text='Events' count={stats.events} item={<Calendar className='w-5 h-5' />} />
            <Stat text='Jobs' count={stats.jobs} item={<BriefcaseBusiness className='w-5 h-5' />} />
            <Stat text='Announcements' count={stats.announcements} item={<Megaphone className='w-5 h-5' />} />
            <Stat text='Organizations' count={stats.organizations} item={<Building2 className='w-5 h-5' />} />
            <Stat text='Locations' count={stats.locations} item={<MapPin className='w-5 h-5' />} />
        </div>
    )
}

function Stat({ item, count, text }: { item: ReactNode, count: number, text: string }) {
    return (
        <div className='p-4 bg-white/5 rounded-md flex flex-col justify-center h-24'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                {item} {text}
            </div>
            <div className='font-bold text-2xl'><CountUp end={count} /></div>
        </div>
    )
}

function CountUp({ end, duration = 1 }: { end: number, duration?: number }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let start = 0
        const increment = end / (duration * 60)
        function step() {
            start += increment
            if (start < end) {
                setCount(Math.floor(start))
                requestAnimationFrame(step)
            } else {
                setCount(end)
            }
        }
        step()
    }, [end])

    return <span>{count}</span>
}
