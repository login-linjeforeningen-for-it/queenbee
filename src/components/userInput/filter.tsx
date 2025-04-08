'use client'

import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'


export default function Filter() {
    const [text, setText] = useState('')
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setText(e.target.value)

        const params = new URLSearchParams(searchParams.toString())
        params.set('q', e.target.value)

        router.push(pathname + '?' + params.toString())
    }

    

    return (
        <div className="cursor-pointer bg-extralight rounded-md h-8 p-1 ml-1 flex justify-evenly items-center gap-2 select-none">
            <input 
                className="px-2" 
                placeholder='Filter' 
                value={text} 
                onChange={handleChange}
            />
        </div>
    )
}
