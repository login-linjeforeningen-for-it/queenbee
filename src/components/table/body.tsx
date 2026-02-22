import { RoleRenderer } from '@components/preview/discordRole'
import { BoxesIcon, Edit, EllipsisVertical, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, RefObject, useEffect } from 'react'
import React from 'react'
import useClickOutside from '@hooks/useClickOutside'
import Menu, { MenuButton } from './menu'

type BodyProps = {
    list: object[]
    headers: string[]
    deleteAction?: (id: string) => void
    roles?: Role[]
    hideMenu?: boolean
}

export default function Body({ list, headers, deleteAction, roles, hideMenu }: BodyProps) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)
    const [anchor, setAnchor] = useState<{ top: number; right: number } | null>(null)
    const pathname = usePathname()
    const router = useRouter()
    const menuRef = useRef<HTMLDivElement>(null)
    const tbodyRef = useRef<HTMLTableSectionElement>(null)

    useClickOutside(menuRef as RefObject<HTMLElement>, () => setOpenMenuId(null))

    useEffect(() => {
        const el = tbodyRef.current
        if (!el) return
        const close = () => setOpenMenuId(null)
        el.addEventListener('scroll', close)
        return () => el.removeEventListener('scroll', close)
    }, [])

    return (
        <tbody ref={tbodyRef} className='bg-login-500/50 divide-y divide-login-600 block overflow-y-auto flex-1 min-h-0'>
            {list.map((_, index) => {
                const entries = Object.entries(list[index])
                const id = String(entries[0][1])

                return (
                    <tr
                        key={index}
                        className='flex w-full'
                        onContextMenu={(e) => {
                            e.preventDefault()
                            setAnchor({ top: e.clientY, right: window.innerWidth - e.clientX })
                            setOpenMenuId(id)
                        }}
                    >
                        {entries.map(([key, value]) => {
                            if (!headers.includes(key)) return null
                            return (
                                <td
                                    key={key}
                                    className='flex-1 px-6 py-4 whitespace-nowrap text-sm text-login-100 min-w-40 flex items-center'
                                >
                                    <div className='relative'>
                                        <h1>
                                            {key === 'roles' && roles ? (
                                                (value as string[]).map((roleId, idx) => (
                                                    <RoleRenderer
                                                        key={idx}
                                                        roleId={roleId}
                                                        roles={roles}
                                                    />
                                                ))
                                            ) : React.isValidElement(value) ? (
                                                value
                                            ) : (
                                                formatValue(key, value as string | number)
                                            )}
                                        </h1>
                                    </div>
                                </td>
                            )
                        })}
                        {!hideMenu && (
                            <td
                                className='shrink-0 w-16 flex flex-row justify-end p-2 px-4
                                    whitespace-nowrap text-right text-sm font-medium'
                            >
                                <div className='relative'>
                                    <button
                                        type='button'
                                        className={`
                                        p-1.5 rounded flex items-start
                                        hover:bg-login-400 justify-center
                                        ${openMenuId === id ? 'bg-login-400' : ''}
                                    `}
                                        onClick={(e) => {
                                            const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect()
                                            const coords = { top: rect.bottom + 4, right: window.innerWidth - rect.right }
                                            setAnchor(openMenuId === id ? null : coords)
                                            setOpenMenuId(openMenuId === id ? null : id)
                                        }}
                                    >
                                        <span
                                            className={`text-xl leading-none select-none ${openMenuId === id ? 'text-login-100' : ''}`}
                                        >
                                            <EllipsisVertical className='h-5 w-5' />
                                        </span>
                                    </button>
                                    {openMenuId === id && anchor && (
                                        <Menu
                                            ref={menuRef}
                                            anchor={anchor}
                                        >
                                            <MenuButton
                                                icon={<Edit />}
                                                text='Edit'
                                                onClick={() => {
                                                    setOpenMenuId(null)
                                                    router.push(`${pathname}/update/${id}`)
                                                }}
                                            />
                                            <MenuButton
                                                icon={<BoxesIcon />}
                                                text='Duplicate'
                                                onClick={() => {
                                                    setOpenMenuId(null)
                                                    router.push(`${pathname}/create/${id}`)
                                                }}
                                            />
                                            <MenuButton
                                                icon={<X />}
                                                text='Delete'
                                                onClick={() => {
                                                    setOpenMenuId(null)
                                                    deleteAction?.(id)
                                                    router.refresh()
                                                }}
                                                className='text-red-400'
                                            />
                                        </Menu>
                                    )}
                                </div>
                            </td>
                        )}
                    </tr>
                )
            })}
        </tbody>
    )
}

const nullableTimeKeys = ['date', 'last_sent', 'time']

const ISODateTimeReg = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/
const ISODateReg = /^\d{4}-\d{2}-\d{2}$/
const ISOTimeReg = /^\d{2}:\d{2}(:\d{2})?$/

const OsloTZ = { timeZone: 'Europe/Oslo', second: undefined } as const
const OsloTime: Intl.DateTimeFormatOptions = { ...OsloTZ, hour: '2-digit', minute: '2-digit' }
const OsloDateTime: Intl.DateTimeFormatOptions = { ...OsloTime, year: 'numeric', month: '2-digit', day: '2-digit' }

function formatValue(key: string, value: string | number) {
    if (nullableTimeKeys.includes(key) && !value) {
        return 'Never'
    }

    if (typeof value === 'string') {
        if (ISODateTimeReg.test(value)) {
            return new Date(value).toLocaleString('nb-NO', OsloDateTime)
        }

        if (ISODateReg.test(value)) {
            return new Date(value).toLocaleDateString('nb-NO', OsloTZ)
        }

        if (ISOTimeReg.test(value)) {
            return new Date(`1970-01-01T${value}`).toLocaleTimeString('nb-NO', OsloTime)
        }
    }

    if (key.includes('capacity')) {
        return value === 0 ? 'Unlimited' : value
    }

    return value
}
