'use client'

import type { ElementType } from 'react'
import Link from 'next/link'
import { StatCard } from 'uibee/components'

type StatProps = {
    text: string
    link?: string
    count: number
    item: ElementType
}

export default function Stat({ text, link, count, item }: StatProps) {
    return (
        <Link href={`/${link || text}`} className='rounded-xl transition hover:brightness-125'>
            <StatCard icon={item} label={text.charAt(0).toUpperCase() + text.slice(1)} value={String(count)} />
        </Link>
    )
}
