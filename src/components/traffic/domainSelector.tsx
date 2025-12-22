'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Select from '@components/inputs/select'

type DomainSelectorProps = {
    domains: string[]
    selectedDomain?: string
}

export default function DomainSelector({ domains, selectedDomain }: DomainSelectorProps) {
    const router = useRouter()
    const [value, setValue] = useState(selectedDomain || '')

    const domainOptions = [
        { value: '', label: 'All Domains' },
        ...domains.map(domain => ({ value: domain, label: domain }))
    ]

    function handleChange(newValue: string | number) {
        const domain = newValue as string
        setValue(domain)
        const params = new URLSearchParams(window.location.search)

        if (domain) {
            params.set('domain', domain)
        } else {
            params.delete('domain')
        }

        router.push(`${window.location.pathname}?${params.toString()}`)
    }

    return (
        <Select
            name='domain-select'
            label='Select Domain'
            value={value}
            setValue={handleChange}
            options={domainOptions}
            className='max-w-2xs'
        />
    )
}
