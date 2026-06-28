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
        <Link href={`/${link || text}`}>
            <StatCard icon={item} label={text} value={String(count)} />
        </Link>
    )
}
