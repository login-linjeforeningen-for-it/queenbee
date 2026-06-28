'use client'

import { Tabs } from 'uibee/components'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

type HoneyTabsProps = {
    services: string[]
    activeType: string
}

export default function HoneyTabs({ services, activeType }: HoneyTabsProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    function handleTabChange(id: string) {
        const params = new URLSearchParams(searchParams.toString())
        params.set('type', id)
        params.delete('page')
        router.push(`${pathname}?${params.toString()}`)
    }

    const tabs = services.map(s => ({
        id: s,
        label: `${s[0].toUpperCase()}${s.slice(1)}`
    }))

    return (
        <Tabs
            tabs={tabs}
            activeTab={activeType}
            onTabChange={handleTabChange}
        >{null}</Tabs>
    )
}
