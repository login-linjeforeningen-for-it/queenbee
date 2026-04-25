'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Stat = {
    text: string
    link?: string
    count: number
    item: React.ReactNode
}

export default function Stat({ text, link, count, item }: Stat) {
    return (
        <Link
            href={`/${link || text}`}
            className='flex h-24 flex-col justify-center rounded-xl border border-white/5 bg-login-50/5 p-4'
        >
            <div className='flex items-center gap-2 text-sm text-muted-foreground capitalize'>
                {item} {text}
            </div>
            <div className='text-2xl font-bold text-login-50'><CountUp end={count} /></div>
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
