import { CircleAlert } from 'lucide-react'

export default function Error({message}: {message: string}) {
    return (
        <div className='flex flex-row items-center gap-1 pt-1'>
            <CircleAlert className='w-4 stroke-red-500/50' />
            <span className='text-sm text-red-500/50'>{message}</span>
        </div>
    )
}