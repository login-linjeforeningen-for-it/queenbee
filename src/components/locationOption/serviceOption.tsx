'use client'

import { setCookie } from 'utilbee/utils'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

type OptionProps = {
    value: string
    active: string
}

export default function Option({ value, active }: OptionProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const isActive = value === active

    function handleClick(value: string) {
        const params = new URLSearchParams(searchParams.toString())
        params.set('type', value)
        router.push(`${pathname}?${params.toString()}`)
        setCookie('service', value)
    }

    return (
        <div className={`${isActive ? 'bg-login/20' : ''} rounded-lg`}>
            <h1
                className={`
                    cursor-pointer px-2 p-1
                    ${isActive ? 'text-login' : 'text-login-400'}
                `}
                onClick={() => handleClick(value)}
            >
                {`${value[0].toUpperCase()}${value.slice(1)}`}
            </h1>
            <div className={`w-full ${isActive ? 'bg-login' : ''} h-px`} />
        </div>
    )
}
