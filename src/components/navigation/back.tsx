'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from 'uibee/components'

export default function BackButton({ pushURL, onClick }: { pushURL?: string; onClick?: () => void }) {
    const router = useRouter()
    return (
        <Button
            type='button'
            icon={<ArrowLeft className='size-4.5' />}
            text='Back'
            variant='secondary'
            onClick={onClick ?? (() => pushURL ? router.push(pushURL) : router.back())}
        />
    )
}
