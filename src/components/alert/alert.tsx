import { ReactNode } from 'react'
import { CircleAlert, TriangleAlert, Info } from 'lucide-react'

type AlertProps = {
    children: ReactNode
    variant?: 'warning' | 'info'
    className?: string
}

export default function Alert({
    children,
    variant = 'warning',
    className = '',
}: AlertProps) {
    const color = variant === 'warning' ? 'bg-red-900'
        : variant === 'info' ? 'bg-blue-600' :
            'bg-gray-900'

    const Icon = variant === 'warning' ? CircleAlert
        : variant === 'info' ? Info :
            TriangleAlert

    return (
        <div
            className={`
                grid grid-cols-[min-content_auto] rounded-lg
                p-[0.5em_1em_0.5em_0.8em] items-start w-fit text-white
                ${color} ${className}
            `}
        >
            <Icon className='w-8 h-8 mr-[0.3rem] stroke-login-50' />
            <div className='self-center'>{children}</div>
        </div>
    )
}
