import { RoleRenderer } from '@components/preview/discordRole'
import { BoxesIcon, Edit, EllipsisVertical, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, RefObject } from 'react'
import { Button } from 'uibee/components'
import useClickOutside from '@hooks/useClickOutside'

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
    const menuRef = useRef<HTMLDivElement>(null)

    useClickOutside(menuRef as RefObject<HTMLElement>, () => setOpenMenuId(null))

    return list.map((_, index) => {
        const entries = Object.entries(list[index])
        const id = String(entries[0][1])

        return (
            <tbody key={index} className='h-8'>
                <tr className='border-y border-login-300'>
                    {entries.map(([key, value]) => {
                        if (!headers.includes(key)) return null
                        return (
                            <td key={key} className='p-2'>
                                <div className='relative group'>
                                    <h1
                                        className={`
                                            overflow-hidden text-ellipsis
                                            whitespace-nowrap max-w-60
                                        `}
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
                    <td className='flex flex-row justify-end p-2 px-4'>
                        <div className='relative'>
                            <button
                                type='button'
                                className={`
                                    p-1.5 rounded flex items-start
                                    hover:bg-login-400 justify-center
                                    ${openMenuId === id ? 'bg-login-400' : ''}
                                `}
                                onClick={() =>
                                    setOpenMenuId(openMenuId === id ? null : id)
                                }
                            >
                                <span className={`
                                    text-xl leading-none select-none
                                    ${openMenuId === id ? 'text-login-100' : ''}
                                `}
                                >
                                    <EllipsisVertical />
                                </span>
                            </button>
                            {openMenuId === id && (
                                <div
                                    ref={menuRef}
                                    className={`
                                    absolute right-0 mt-1 w-30 origin-top-left
                                    rounded-md bg-login-500 border shadow-lg z-20
                                    border-[color:var(--color-login-900 )]
                                `}>
                                    <div className='py-1 px-1 space-y-1'>
                                        <Button
                                            icon={<Edit className='w-5' />}
                                            text='Edit'
                                            color='secondary'
                                            onClick={() => {
                                                setOpenMenuId(null)
                                                router.push(`${pathname}/update/${id}`)
                                            }}
                                            className='px-1! justify-start! w-full hover:bg-login-600!'
                                        />
                                        <Button
                                            icon={<BoxesIcon className='w-5' />}
                                            text='Duplicate'
                                            color='secondary'
                                            onClick={() => {
                                                setOpenMenuId(null)
                                                router.push(`${pathname}/create/${id}`)
                                            }}
                                            className='px-1! justify-start! w-full hover:bg-login-600!'
                                        />
                                        <Button
                                            icon={<X className='w-5' />}
                                            text='Delete'
                                            color='secondary'
                                            onClick={() => {
                                                setOpenMenuId(null)
                                                deleteAction(id)
                                                router.refresh()
                                            }}
                                            className='px-1! justify-start! w-full hover:bg-red-600!'
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
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
