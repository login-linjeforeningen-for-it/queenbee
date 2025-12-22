'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BackButton({pushURL}: {pushURL?: string}) {
    const router = useRouter()
    return (
        <button
            type='button'
            aria-label='Go back'
            onClick={() => pushURL ? router.push(pushURL) : router.back()}
            className={`
                inline-flex items-center gap-2 rounded-lg p-1 px-4
                cursor-pointer hover:text-login bg-login-600 w-fit
            `}
        >
            <ArrowLeft className='size-4.5' />
            <span>Back</span>
        </button>
    )
}
