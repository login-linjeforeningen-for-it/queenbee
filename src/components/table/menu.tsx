import React, { SVGProps } from 'react'
import { createPortal } from 'react-dom'

export default function Menu({ ref, children, anchor }: {
    ref: React.RefObject<HTMLDivElement | null>
    children: React.ReactNode
    anchor: { top: number; right: number }
}) {
    return createPortal(
        <div
            ref={ref}
            style={{ top: anchor.top, right: anchor.right }}
            className='fixed bg-login-500 border border-login-600 rounded-lg shadow-lg z-9999 w-34'
        >
            {children}
        </div>,
        document.body
    )
}

export function MenuButton({
    icon,
    text,
    hotKey,
    onClick,
    className,
}: {
    icon: React.ReactNode
    text: string
    hotKey?: string
    onClick: () => void
    className?: string
}
){
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-login-600 cursor-pointer
                ${className || ''}
            `}
        >
            <div className='flex items-center'>
                {React.cloneElement(icon as React.ReactElement<SVGProps<SVGSVGElement>>, { className: 'w-4 h-4 mr-2' })}
                {text}
            </div>
            <span className='text-xs opacity-50 font-mono'>{hotKey}</span>
        </button>
    )
}
