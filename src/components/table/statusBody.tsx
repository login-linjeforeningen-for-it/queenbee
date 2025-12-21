import { RoleRenderer } from '@components/preview/discordRole'
import Conveyer from '@components/update/conveyer'
import ConveyerStopped from '@components/update/conveyerStopped'
import { ArrowUpCircle, RefreshCcw } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type BodyProps = {
    list: object[]
    headers: string[]
    deleteAction: (id: string) => void
    roles?: Role[]
}

const timeValues = ['date', 'last_sent', 'time']

export default function StatusBody({ list, headers, roles }: BodyProps) {
    const router = useRouter()
    return (list as Container[]).map((item: Container, index) => {
        const entries = Object.entries(list[index])
        // const autoUpdate = await fetch(`/api/system/autoRestart/${item.id}`)
        const autoUpdate = Boolean(Math.floor(Math.random() * 2))

        return (
            <tbody key={index} className='h-8'>
                <tr onClick={() => router.push(`/internal/system/${item.id}`)} className='border-y border-login-900 w-full relative'>
                    {entries.map(([key, value]) => {
                        if (!headers.includes(key)) {
                            return null
                        }

                        return (
                            <td key={key} className='p-2 flex-1'>
                                <Link className='flex gap-2 cursor-pointer' href={`/internal/system/${item.id}`}>
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
                                </Link>
                            </td>
                        )
                    })}
                    <ActionButtons
                        autoUpdate={autoUpdate as unknown as boolean}
                        id={item.id}
                    />
                </tr>
            </tbody>
        )
    })
}

function ActionButtons({ id, autoUpdate: serverAutoUpdate }: { id: string, autoUpdate: boolean }) {
    const [autoUpdate, setAutoUpdate] = useState<boolean>(serverAutoUpdate)
    const [refresh, setRefresh] = useState(false)
    const [update, setUpdate] = useState<boolean | 'inProgress'>(false)

    async function handleAutoUpdate() {
        setAutoUpdate(prev => !prev)
        console.log(`handling of autoupdate of ${id} - todo, value:`, autoUpdate)
    }

    async function handleRefresh() {
        console.log(`handling of refresh of ${id} - todo, value:`, refresh)
        setRefresh(prev => !prev)
    }

    async function handleUpdate() {
        console.log(`handling of update of ${id} - todo, value:`, update)
        setUpdate('inProgress')
    }

    return (
        <td onClick={(e) => e.stopPropagation()} className='p-2 flex-1 flex gap-2 w-full pr-5 justify-end select-none'>
            <div className='flex gap-2 cursor-pointer'>
                {!autoUpdate && <button
                    type='button'
                    className={`
                        mx-auto px-3 py-1.5 rounded flex items-start select-none
                        justify-center cursor-pointer bg-login-500 group
                    `}
                    onClick={handleUpdate}
                >
                    <ArrowUpCircle className='h-4 w-4 group-hover:stroke-green-500' />
                </button>}
                <button
                    type='button'
                    className={`
                        px-3 py-1.5 rounded bg-login-500 flex items-start
                        justify-center cursor-pointer group select-none
                    `}
                    onClick={handleRefresh}
                >
                    <RefreshCcw className='w-4 h-4 group-hover:stroke-green-500' />
                </button>
                <button
                    type='button'
                    className={`
                        h-full w-full rounded group flex select-none
                        items-start justify-center cursor-pointer
                    `}
                    onClick={handleAutoUpdate}
                >
                    <div className='group cursor-pointer'>
                        {autoUpdate && <Conveyer
                            className='cursor-pointer'
                            wheels='rounded-lg stroke stroke-login-200 stroke-3'
                            belt='stroke-login-200'
                            containers='stroke-login-200 group-hover:hidden'
                            middleContainer='stroke-green-500 group-hover:stroke-login-200'
                        />}
                        {!autoUpdate && <ConveyerStopped
                            className='cursor-pointer'
                            wheels='rounded-lg stroke stroke-login-200 stroke-3'
                            belt='stroke-login-200'
                            cross='#ff0000aa'
                        />}
                    </div>
                </button>
            </div>
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
