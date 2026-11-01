'use client'

import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Switch } from 'uibee/components'

type HistoricalSwitchProps = {
    name: string
    label: string
}

export default function HistoricalSwitch({
    name,
    label,
}: HistoricalSwitchProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [value, setValue] = useState(searchParams?.get(name) === 'true')

    function handleChange(newValue: boolean) {
        setValue(newValue)
        const params = new URLSearchParams(searchParams.toString())

        if (newValue) {
            params.set(name, 'true')
        } else {
            params.delete(name)
        }

        params.set('page', '1')
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <Switch
            name={name}
            label={label}
            checked={value}
            onChange={(e) => handleChange(e.target.checked)}
            switchOnly
            reserveError={false}
            className='flex-row items-center gap-2 [&>div]:mb-0'
        />
    )
}
