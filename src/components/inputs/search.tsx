'use client'

import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import Label from './label'

export default function Search() {
    const router = useRouter(),
        pathname = usePathname(),
        searchParams = useSearchParams()
    const [text, setText] = useState(searchParams?.get('q') ?? '')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setText(val)
        const params = new URLSearchParams(searchParams.toString())
        params.set('q', val)
        params.set('page', '1')
        router.push(pathname + '?' + params.toString())
    }

    return (
        <div className='relative flex items-center'>
            <input
                name='search'
                value={text}
                onChange={handleChange}
                type='text'
                className={
                    'block px-2.5 pb-2 pt-3 w-full text-sm rounded-lg ' +
                    'border-[0.10rem] appearance-none border-login-200 ' +
                    'focus:outline-none focus:ring-0 focus:border-login-50 peer'
                }
                placeholder=''
            />
            <Label
                label='Filter'
                value={text}
                required={false}
                showRequired={false}
            />
        </div>
    )
}
