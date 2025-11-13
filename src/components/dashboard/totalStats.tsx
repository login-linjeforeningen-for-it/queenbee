'use client'

import {
    Calendar,
    BriefcaseBusiness,
    Megaphone,
    Building2,
    MapPin,
    Images
} from 'lucide-react'
import Link from 'next/link'
import { ReactNode, useEffect, useState } from 'react'

export default function TotalStats({ stats }: { stats: DashboardTotalStats }) {
    return (
        <div className='mt-4 grid grid-cols-2 md:grid-cols-6 gap-4'>
            <Stat type='events' count={stats.events} item={<Calendar className='w-5 h-5' />} />
            <Stat type='jobs' count={stats.jobs} item={<BriefcaseBusiness className='w-5 h-5' />} />
            <Stat type='announcements' count={stats.announcements} item={<Megaphone className='w-5 h-5' />} />
            <Stat type='organizations' count={stats.organizations} item={<Building2 className='w-5 h-5' />} />
            <Stat type='locations' count={stats.locations} item={<MapPin className='w-5 h-5' />} />
            <Stat type='albums' count={stats.albums} item={<Images className='w-5 h-5' />} />
        </div>
    )
}

function Stat({ type, count, item }: { type: string, count: number, item: ReactNode }) {
    return (
        <Link href={`/dashboard/${type}`} className='p-4 bg-white/5 rounded-md flex flex-col justify-center h-24'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground capitalize'>
                {item} {type}
            </div>
            <div className='font-bold text-2xl'><CountUp end={count} /></div>
        </Link>
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
