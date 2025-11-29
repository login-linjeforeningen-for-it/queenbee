import { RoleRenderer } from '@components/preview/discordRole'
import Link from 'next/link'

type BodyProps = {
    list: object[]
    headers: string[]
    deleteAction: (id: string) => void
    roles?: Role[]
}

const timeValues = ['date', 'last_sent', 'time']

export default function StatusBody({ list, headers, roles }: BodyProps) {
    return list.map((item: unknown, index) => {
        const entries = Object.entries(list[index])

        return (
            <tbody key={index} className='h-8'>
                <tr className='border-y border-login-900 w-full relative'>
                    {entries.map(([key, value]) => {
                        if (!headers.includes(key)) {
                            return null
                        }

                        return (
                            <td key={key} className='p-2 flex-1'>
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
                                        ) : (formatValue(key, value))}
                                    </h1>
                                </div>
                            </td>
                        )
                    })}
                    <ActionButtons id={(item as { id: string }).id} />
                </tr>
            </tbody>
        )
    })
}

function ActionButtons({ id }: { id: string }) {
    return (
        <td className='p-2 flex gap-2 w-full right-0'>
            <Link className='flex gap-2 cursor-pointer' href={`/internal/system/${id}`}>
                <button
                    type='button'
                    className={
                        'mx-auto px-3 py-1.5 rounded ' +
                        'hover:bg-login-400 ' +
                        ' flex items-start justify-center ' +
                        'bg-login-400'
                    }
                    onClick={() => {}}
                >
                    {/* prettier-ignore */}
                    <span className={'text-xl leading-none select-none hover:login-300'}>restart</span>
                </button>
                <button
                    type='button'
                    className={
                        'mx-auto px-3 py-1.5 rounded ' +
                        'hover:bg-login-400 ' +
                        ' flex items-start justify-center ' +
                        'bg-login-400'
                    }
                    onClick={() => {}}
                >
                    {/* prettier-ignore */}
                    <span className={'text-xl leading-none select-none hover:login-300'}>update</span>
                </button>
                <button
                    type='button'
                    className={
                        'mx-auto px-3 py-1.5 rounded ' +
                        'hover:bg-login-400 ' +
                        ' flex items-start justify-center ' +
                        'bg-login-400'
                    }
                    onClick={() => {}}
                >
                    {/* prettier-ignore */}
                    <span className={'text-xl leading-none select-none hover:login-300'}>autoupdate</span>
                </button>
            </Link>
        </td>
    )
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
