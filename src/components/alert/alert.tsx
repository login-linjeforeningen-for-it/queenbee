import { ReactNode } from 'react'
import { CircleAlert } from 'lucide-react'

type AlertProps = {
    children: ReactNode
    variant?: string
    className?: string
}

export default function Alert({
    children,
    variant = 'info',
    className = '',
}: AlertProps) {
    return (
        <div
            className={`
                grid grid-cols-[min-content_auto] rounded-lg
                p-[0.5em_1em_0.5em_0.8em] items-start w-fit text-white
                ${variant === 'info' ? 'bg-red-900' : ''} ${className}
            `}
        >
            <CircleAlert className='w-8 h-8 mr-[0.3rem] stroke-login-50' />
            <div className='self-center'>{children}</div>
        </div>
    )
}
