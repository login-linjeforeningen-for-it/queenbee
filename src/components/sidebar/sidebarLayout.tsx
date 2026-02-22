'use client'

import { useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import SidebarVersion from './sidebarVersion'

export type SidebarItem = {
    name: string
    path: string
    image: React.ReactNode
    status?: React.ReactNode
    items?: {
        name: string
        path: string
    }[]
}

type SidebarLayoutProps = {
    items: SidebarItem[]
    bottomAction?: (expanded: boolean) => React.ReactNode
    mobile?: boolean
}

export default function SidebarLayout({ items, bottomAction, mobile = false }: SidebarLayoutProps) {
    const [expanded, setExpanded] = useState(true)
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')

    return (
        <aside
            className={`
                flex flex-col bg-login-900 border-r border-login-100/10
                transition-all duration-300 ease-in-out relative
                ${mobile ? 'w-full h-[calc(100vh-var(--h-navbar))]' : `h-full ${expanded ? 'w-64' : 'w-20'}`}
            `}
        >
            {!mobile && (
                <div className={`
                    relative transition-all duration-300 ease-in-out
                    ${expanded ? 'h-16' : 'h-30'} 
                    p-4 mb-2
                `}>
                    <div className={`
                        flex items-center transition-all duration-300 
                        absolute top-4
                         ${expanded ? 'left-4 gap-3' : 'left-1/2 -translate-x-1/2 gap-0'}
                    `}>
                        <div className='relative h-8 w-8 min-w-8'>
                            <Image
                                src='/images/queenbee-logo.png'
                                alt='QueenBee'
                                fill
                                className='object-contain'
                                priority
                            />
                        </div>
                        <span className={`
                            font-bold text-lg tracking-wide text-login-50 whitespace-nowrap overflow-hidden transition-all duration-300
                            ${expanded ? 'opacity-100 max-w-48' : 'opacity-0 max-w-0'}
                        `}>
                            QueenBee
                        </span>
                    </div>

                    <button
                        onClick={() => setExpanded((curr) => !curr)}
                        className={`
                            absolute p-1.5 rounded-lg hover:bg-login-800 text-login-200 transition-all duration-300
                            ${expanded ? 'top-4 right-4' : 'top-18 left-1/2 -translate-x-1/2'}
                        `}
                    >
                        {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>
            )}

            {mobile && <div className='h-4' />}

            <div className='flex-1 flex flex-col gap-1 px-3 overflow-y-auto overflow-x-hidden no-scrollbar'>
                {items.map((value, index) => {
                    const isActive = pathname === value.path || (value.items && value.items.some(i => i.path.includes('?')
                        ? fullPath.startsWith(i.path) :
                        pathname.startsWith(i.path))
                    )
                    return (
                        <div key={index} className='flex flex-col gap-1'>
                            <Link
                                href={value.path}
                                className={`
                                    flex items-center p-3 rounded-lg overflow-hidden
                                    transition-all duration-200 group relative
                                    ${isActive ? 'bg-login-800 text-login' : 'hover:bg-login-800/50 text-login-200 hover:text-login-100'}
                                `}
                                title={!expanded ? value.name : ''}
                            >
                                <div className={`
                                    min-w-6 w-6 flex items-center justify-center transition-all duration-300
                                    ${expanded ? '' : 'translate-x-1'}
                                    ${isActive ? '[&>svg]:stroke-login' : 'group-hover:[&>svg]:stroke-login-100'}
                                `}>
                                    {value.image}
                                </div>
                                <span
                                    className={`
                                        whitespace-nowrap overflow-hidden transition-all duration-300
                                        ${expanded ? 'opacity-100 max-w-48 ml-3' : 'opacity-0 max-w-0 ml-0'}
                                    `}
                                >
                                    {value.name}
                                </span>
                                {value.status && (
                                    <div className={`
                                        flex items-center justify-center
                                        ${expanded ? 'ml-auto' : 'absolute top-1 right-1 scale-75'}
                                    `}>
                                        {value.status}
                                    </div>
                                )}
                            </Link>
                            {value.items && (
                                <div className={`
                                    flex flex-col gap-1 ml-6 border-l border-login-800 pl-2 overflow-hidden
                                    transition-all duration-300 ease-in-out
                                    ${expanded && isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                                `}>
                                    {value.items.map((subItem, subIndex) => {
                                        const isSubActive = subItem.path.includes('?')
                                            ? fullPath.startsWith(subItem.path)
                                            : pathname === subItem.path
                                        return (
                                            <Link
                                                key={`${index}-${subIndex}`}
                                                href={subItem.path}
                                                className={`
                                                    p-2 rounded-lg text-sm transition-all duration-200
                                                    ${isSubActive
                                                ? 'text-login bg-login-800/50'
                                                : 'text-login-300 hover:text-login-100 hover:bg-login-800/30'
                                            }
                                                `}
                                            >
                                                {subItem.name}
                                            </Link>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            <div className='p-3 border-t border-login-100/10 flex flex-col gap-2'>
                {bottomAction && bottomAction(expanded)}

                <button
                    onClick={() => window.location.href = '/api/logout'}
                    className={`
                        flex items-center p-3 rounded-lg w-full overflow-hidden
                        hover:bg-red-500/10 text-login-200 hover:text-red-400
                        transition-colors group
                    `}
                    title={!expanded ? 'Logout' : ''}
                >
                    <div className={`
                        min-w-6 w-6 flex items-center justify-center transition-all duration-300
                        ${expanded ? '' : 'translate-x-1'}
                    `}>
                        <LogOut className='w-6 min-w-6' />
                    </div>
                    <span
                        className={`
                            whitespace-nowrap overflow-hidden transition-all duration-300
                            ${expanded ? 'opacity-100 max-w-48 ml-3' : 'opacity-0 max-w-0 ml-0'}
                        `}
                    >
                        Logout
                    </span>
                </button>

                <div
                    className={`
                        transition-all duration-300 ease-in-out overflow-hidden
                        ${expanded ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}
                    `}
                >
                    <SidebarVersion />
                </div>
            </div>
        </aside>
    )
}
