import { RoleRenderer } from '@components/preview/discordRole'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const timeValues = ['date', 'last_sent', 'time']

type BodyProps = {
    list: object[]
    headers: string[]
    deleteAction: (id: string) => void
    roles?: Role[]
}

export default function Body({ list, headers, deleteAction, roles }: BodyProps) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)
    const pathname = usePathname()
    const router = useRouter()

    return list.map((_, index) => {
        const entries = Object.entries(list[index])
        const id = String(entries[0][1])

        return (
            <tbody key={index} className='h-8'>
                <tr className='border-y border-login-900'>
                    {entries.map(([key, value]) => {
                        if (!headers.includes(key)) return null
                        return (
                            <td key={key} className='p-2'>
                                <div className='relative group'>
                                    <h1
                                        className={
                                            'overflow-hidden text-ellipsis ' +
                                            'whitespace-nowrap max-w-60'
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
                    <td className='p-2'>
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
                                            'text-(--color-delete)'
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
