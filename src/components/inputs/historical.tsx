'use client'

import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import Switch from './switch'

type HistoricalSwitchProps = {
    name: string
    label: string
    tooltip?: string
}

export default function HistoricalSwitch({
    name,
    label,
    tooltip,
}: HistoricalSwitchProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [value, setValue] = useState(searchParams?.get('historical') === 'true')

    function handleChange(newValue: boolean) {
        setValue(newValue)
        const params = new URLSearchParams(searchParams.toString())

        if (newValue) {
            params.set('historical', 'true')
        } else {
            params.delete('historical')
        }

        params.set('page', '1')
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <Switch
            name={name}
            label={label}
            value={value}
            setValue={handleChange}
            className={'py-1.5! px-2! w-fit!'}
            tooltip={tooltip}
        />
    )
}
