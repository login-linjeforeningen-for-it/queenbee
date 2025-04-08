'use client'

import { setCookie } from '@utils/cookies'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'


enum Location {
    Address = 'address',
    Mazemap = 'mazemap',
    Coordinate = 'coordinate'
}

type OptionProps = {
    value: Location
    active: Location
}

export default function Option ({value, active}: OptionProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const isActive = value === active

    function handleClick(value: Location) {
        const params = new URLSearchParams(searchParams.toString())
        params.set('t', value)
        router.push(pathname + '?' + params.toString())
        setCookie('location', value)
    }

    return (
        <div className={`${isActive ? 'bg-login/20' : ''} rounded-lg`}>
            <h1 
                className={`cursor-pointer px-2 p-1 ${isActive ? 'text-login' : 'text-superlight'}`} 
                onClick={(() => handleClick(value))}
            >
                {`${value[0].toUpperCase()}${value.slice(1)}`}
            </h1>
            <div className={`w-full ${isActive ? 'bg-login' : ''} h-[1px]`} />
        </div>
    )
}
