'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { RoleRenderer } from '@components/preview/discordRole'

const timeValues = ['date', 'last_sent', 'time']

type TableProps = {
    list: object[]
    headers?: string[]
    deleteAction: (id: string) => void
    roles?: Role[]
}

type HeaderProps = {
    keys: string[]
    headers: string[]
}

type BodyProps = {
    list: object[]
    headers: string[]
    deleteAction: (id: string) => void
    roles?: Role[]
}

export default function Table({ list, headers, deleteAction, roles }: TableProps) {
    const keys = Object.keys(list[0])
    headers = headers || keys

    return (
        <div className='relative flex-1 noscroll w-full overflow-auto'>
            <table className='w-full relative border-collapse rounded-lg pl-2'>
                <Header
                    keys={keys}
                    headers={headers}
                />
                <Body
                    list={list}
                    headers={headers}
                    deleteAction={deleteAction}
                    roles={roles}
                />
            </table>
        </div>
    )
}

function Header({ keys, headers }: HeaderProps) {
    const [column, setColumn] = useState(keys[0])
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (
            searchParams.get('order') !== order ||
            searchParams.get('column') !== column
        ) {
            params.set('order', order)
            params.set('column', column)
            params.set('page', '1')
            router.push(`${pathname}?${params.toString()}`)
        }
    }, [order, column, pathname, router, searchParams])

    function handleChange(key: string) {
        setColumn(key)
        setOrder((prev) => (key === column && prev === 'asc' ? 'desc' : 'asc'))
    }

    return (
        <thead className='bg-login-500 h-[2rem]'>
            <tr>
                {keys.map((key) => {
                    // prettier-ignore
                    const value =
                        key.length < 3
                            ? key.toUpperCase()
                            : `${key[0].toUpperCase()}${key
                                .slice(1)
                                .replaceAll('_', ' ')}`
                    if (!headers.includes(key)) {
                        return null
                    }

                    return (
                        <th key={key} className='whitespace-nowrap text-left'>
                            <button
                                className={
                                    'w-full h-full p-[0.5rem] flex flex-row ' +
                                    'items-center justify-between group'
                                }
                                onClick={() => handleChange(key)}
                            >
                                <h1>{value}</h1>
                                {column === key ? (
                                    order === 'asc' ? (
                                        <ChevronUp className='h-[1.5rem]' />
                                    ) : (
                                        <ChevronDown className='h-[1.5rem]' />
                                    )
                                ) : (
                                    <ChevronUp
                                        className={
                                            'h-[1.5rem] stroke-login-200 ' +
                                            'opacity-0 group-hover:opacity-100'
                                        }
                                    />
                                )}
                            </button>
                        </th>
                    )
                })}
                <th />
            </tr>
        </thead>
    )
}

function Body({ list, headers, deleteAction, roles }: BodyProps) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)
    const pathname = usePathname()
    const router = useRouter()

    return list.map((_, index) => {
        const entries = Object.entries(list[index])
        const id = String(entries[0][1])

        return (
            <tbody key={index} className='bg-login-500 h-[2rem]'>
                <tr className='border-y-1 border-login-900'>
                    {entries.map(([key, value]) => {
                        if (!headers.includes(key)) return null
                        return (
                            <td key={key} className='p-[0.5rem]'>
                                <div className='relative group'>
                                    <h1
                                        className={
                                            'overflow-hidden text-ellipsis ' +
                                            'whitespace-nowrap max-w-[15rem]'
                                        }
                                    >
                                        {key === 'roles' && roles ? (
                                            (value as string[]).map((roleId, idx) => (
                                                <RoleRenderer key={idx} roleId={roleId} roles={roles} />
                                            ))
                                        ) : (
                                            formatValue(key, value)
                                        )}
                                    </h1>
                                </div>
                            </td>
                        )
                    })}
                    <td className='p-[0.5rem]'>
                        <button
                            type='button'
                            className={
                                'mx-auto px-3 py-1.5 rounded ' +
                                'hover:bg-login-400 ' +
                                ' flex items-start justify-center ' +
                                `${openMenuId === id ? 'bg-login-400' : ''}`
                            }
                            onClick={() =>
                                setOpenMenuId(openMenuId === id ? null : id)
                            }
                        >
                            {/* prettier-ignore */}
                            <span className={'text-xl leading-none select-none '
                                + `${openMenuId === id ? 'text-login-300' : ''}`
                            }
                            >
                                ⋮
                            </span>
                        </button>
                        {openMenuId === id && (
                            <div
                                className={
                                    'absolute right-0 mt-1 w-28 ' +
                                    'origin-top-right rounded-md ' +
                                    'bg-login-500 border ' +
                                    'border-[color:var(--color-login-900 )] ' +
                                    'shadow-lg z-20'
                                }
                            >
                                <div className='py-1'>
                                    <button
                                        className={
                                            'w-full text-left px-3 py-1.5 ' +
                                            'text-sm hover:bg-login-400'
                                        }
                                        onClick={() => {
                                            setOpenMenuId(null)
                                            router.push(
                                                `${pathname}/update/${id}`
                                            )
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={
                                            'w-full text-left px-3 py-1.5 ' +
                                            'text-sm hover:bg-login-400'
                                        }
                                        onClick={() => {
                                            setOpenMenuId(null)
                                            router.push(
                                                `${pathname}/create/${id}`
                                            )
                                        }}
                                    >
                                        Duplicate
                                    </button>
                                    <button
                                        className={
                                            'w-full text-left px-3 py-1.5 ' +
                                            'text-sm hover:bg-login-400 ' +
                                            'text-[color:var(--color-delete)]'
                                        }
                                        onClick={() => {
                                            setOpenMenuId(null)
                                            deleteAction(id)
                                            router.refresh()
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </td>
                </tr>
            </tbody>
        )
    })
}

function formatValue(key: string, value: string | number) {
    if (timeValues.includes(key) && !value) {
        return 'Never'
    }

    if (timeValues.includes(key)) {
        return new Date(value).toLocaleString('nb-NO', {
            timeZone: 'Europe/Oslo',
        })
    }

    if (key.includes('capacity')) {
        return value === 0 ? 'Unlimited' : value
    }

    return value
}
