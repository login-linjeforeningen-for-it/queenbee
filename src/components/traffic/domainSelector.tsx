'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Select } from 'uibee/components'

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

    function handleChange(newValue: string | number | null) {
        const domain = newValue ? newValue.toString() : ''
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
            value={value}
            onChange={handleChange}
            options={domainOptions}
            textSize='md'
            className='w-full max-w-2xs'
        />
    )
}
