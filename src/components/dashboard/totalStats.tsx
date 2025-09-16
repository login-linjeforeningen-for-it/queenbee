'use client'

import {
    Calendar,
    BriefcaseBusiness,
    Megaphone,
    Building2,
    MapPin
} from 'lucide-react'
import { useEffect, useState } from 'react'

export default function TotalStats({ stats }: { stats: DashboardTotalStats }) {
    return (
        <div className='mt-4 grid grid-cols-2 md:grid-cols-5 gap-4'>
            <div className='p-4 bg-white/5 rounded-md flex flex-col justify-center h-24'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Calendar className='w-5 h-5' /> Events
                </div>
                <div className='font-bold text-2xl'><CountUp end={stats.events} /></div>
            </div>
            <div className='p-4 bg-white/5 rounded-md flex flex-col justify-center h-24'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <BriefcaseBusiness className='w-5 h-5' /> Jobs
                </div>
                <div className='font-bold text-2xl'><CountUp end={stats.jobs} /></div>
            </div>
            <div className='p-4 bg-white/5 rounded-md flex flex-col justify-center h-24'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Megaphone className='w-5 h-5' /> Announcements
                </div>
                <div className='font-bold text-2xl'><CountUp end={stats.locations} /></div>
            </div>
            <div className='p-4 bg-white/5 rounded-md flex flex-col justify-center h-24'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Building2 className='w-5 h-5' /> Organizations
                </div>
                <div className='font-bold text-2xl'><CountUp end={stats.organizations} /></div>
            </div>
            <div className='p-4 bg-white/5 rounded-md flex flex-col justify-center h-24'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <MapPin className='w-5 h-5' /> Locations
                </div>
                <div className='font-bold text-2xl'><CountUp end={stats.locations} /></div>
            </div>
        </div>
    )
}

function CountUp({ end, duration = 1 }: { end: number, duration?: number }) {
    const [count, setCount] = useState(0)
    useEffect(() => {
        let start = 0
        const increment = end / (duration * 60)
        const step = () => {
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