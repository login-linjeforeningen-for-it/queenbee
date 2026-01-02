'use client'

import { SearchIcon } from 'lucide-react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input } from 'uibee/components'

export default function Search({ className }: { className?: string }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [text, setText] = useState(searchParams?.get('q') ?? '')

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value
        setText(val)
        const params = new URLSearchParams(searchParams.toString())
        params.set('q', val)
        params.set('page', '1')
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className={`relative flex items-center m-1 ${className}`}>
            <Input
                name='search'
                value={text}
                onChange={handleChange}
                type='text'
                placeholder='Search...'
                icon={<SearchIcon />}
            />
        </div>
    )
}
