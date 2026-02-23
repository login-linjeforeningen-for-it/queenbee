'use client'

import Alert from '@components/alert/alert'
import Search from '@components/inputs/search'
import Table from '@components/table/table'
import Pagination from '@components/table/pagination'
import getDocker from '@utils/api/internal/system/getDocker'
import Conveyer from '@components/update/conveyer'
import ConveyerStopped from '@components/update/conveyerStopped'
import { ArrowUpCircle, RefreshCcw } from 'lucide-react'
import { ChangeEvent, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type PageClientProps = {
    docker: Docker
    deleteAction: (id: string) => Promise<void>
}
const headers = [
    'id',
    'name',
    'status',
    'actions'
]

const refreshOptions = [
    { label: 'Off', value: 0 },
    { label: '1s', value: 1000 },
    { label: '3s', value: 3000 },
    { label: '5s', value: 5000 },
    { label: '10s', value: 10000 },
    { label: '30s', value: 30000 },
    { label: '1m', value: 60000 },
    { label: '5m', value: 300000 },
]

function ActionButtons({ id, initialAutoUpdate }: { id: string, initialAutoUpdate: boolean }) {
    const [autoUpdate, setAutoUpdate] = useState<boolean>(initialAutoUpdate)
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
        <div onClick={(e) => e.stopPropagation()} className='flex gap-2 w-full justify-end select-none'>
            {!autoUpdate && <button
                type='button'
                className={`
                    px-3 py-1.5 rounded flex items-center
                    justify-center cursor-pointer bg-login-500 group
                `}
                onClick={handleUpdate}
            >
                <ArrowUpCircle className='h-4 w-4 group-hover:stroke-green-500' />
            </button>}
            <button
                type='button'
                className={`
                    px-3 py-1.5 rounded bg-login-500 flex items-center
                    justify-center cursor-pointer group select-none
                `}
                onClick={handleRefresh}
            >
                <RefreshCcw className='w-4 h-4 group-hover:stroke-green-500' />
            </button>
            <button
                type='button'
                className={`
                    px-2 rounded group flex select-none
                    items-center justify-center cursor-pointer
                `}
                onClick={handleAutoUpdate}
            >
                <div className='group cursor-pointer'>
                    {autoUpdate ? <Conveyer
                        className='cursor-pointer w-8 h-8'
                        wheels='rounded-lg stroke stroke-login-200 stroke-3'
                        belt='stroke-login-200'
                        containers='stroke-login-200 group-hover:hidden'
                        middleContainer='stroke-green-500 group-hover:stroke-login-200'
                    /> : <ConveyerStopped
                        className='cursor-pointer w-8 h-8'
                        wheels='rounded-lg stroke stroke-login-200 stroke-3'
                        belt='stroke-login-200'
                        cross='#ff0000aa'
                    />}
                </div>
            </button>
        </div>
    )
}

export default function PageClient({ docker: dockerServer, deleteAction }: PageClientProps) {
    const [docker, setDocker] = useState(dockerServer)
    const [autoRefresh, setAutoRefresh] = useState(10000)
    const searchParams = useSearchParams()
    const query = searchParams?.get('q')?.toLowerCase() ?? ''
    const limit = 25
    const filteredContainers = docker?.containers?.filter(container =>
        container.name.toLowerCase().includes(query) ||
        container.id.toLowerCase().includes(query) ||
        container.status.toLowerCase().includes(query)
    ) || []

    const tableList = filteredContainers.map(container => ({
        system_table_id: container.id,
        id: <span className='font-mono text-xs text-login-200'>{container.id.substring(0, 12)}</span>,
        name: <span className='font-medium text-white'>{container.name}</span>,
        status: (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                container.status.toLowerCase().includes('up')
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
                {container.status}
            </span>
        ),
        actions: (
            <ActionButtons
                id={container.id}
                initialAutoUpdate={Boolean(Math.floor(Math.random() * 2))}
            />
        )
    }))

    useEffect(() => {
        if (autoRefresh === 0) {
            return
        }

        const intervalId = setInterval(async () => {
            const updatedDocker = await getDocker()
            setDocker(updatedDocker)
        }, autoRefresh)

        return () => clearInterval(intervalId)
    }, [autoRefresh])

    function handleAutoRefresh(e: ChangeEvent<HTMLSelectElement>) {
        const selectedOption = refreshOptions.find(opt => opt.label === e.target.value)
        if (selectedOption) {
            setAutoRefresh(selectedOption.value)
        }
    }

    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <div className='flex w-full justify-between'>
                    <div className='flex gap-2 items-center'>
                        <h1 className='font-semibold text-lg'>System</h1>
                    </div>
                    <div className='flex items-center gap-2'>
                        <h1 className='font-semibold text-sm'>Autorefresh</h1>
                        <select
                            className='text-white/80 rounded-md py-1 px-2 outline-none'
                            value={refreshOptions.find(opt => opt.value === autoRefresh)?.label || '3s'}
                            onChange={handleAutoRefresh}
                        >
                            {refreshOptions.map(option => (
                                <option key={option.label} value={option.label}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='flex w-full justify-between items-center py-2'>
                    <Search />
                </div>
            </div>
            {!filteredContainers.length && query.length ? (
                <div className='w-full h-full flex items-center justify-center'>
                    <Alert>No containers matches query '{query}'</Alert>
                </div>
            ) : !filteredContainers.length ? (
                <div className='w-full h-full flex items-center justify-center'>
                    <Alert>Containers unavailable</Alert>
                </div>
            ) : (
                <div className='flex-1 flex flex-col overflow-hidden pt-2 gap-2'>
                    <Table
                        list={tableList}
                        headers={headers}
                        deleteAction={deleteAction}
                        hideMenu={true}
                        redirectPath='/internal/system'
                    />
                    <Pagination pageSize={limit} totalRows={docker.count} />
                </div>
            )}
        </div>
    )
}
