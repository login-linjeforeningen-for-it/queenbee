'use client'

import ServiceForm from '@components/status/serviceForm'
import BackButton from '@components/navigation/back'
import NewTag from '@components/status/newTag'
import ServiceListHeader from '@components/status/serviceListHeader'
import ServiceStatus from '@components/status/serviceStatus'
import Statistics from '@components/status/statistics'
import getNotifications from '@utils/api/beekeeper/services/getNotifications'
import getServices from '@utils/api/beekeeper/services/getServices'
import getTags from '@utils/api/beekeeper/services/getTags'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from 'uibee/components'
import Table from '@components/table/table'
import Marquee from '@components/shared/marquee'
import barColor from '@utils/status/barColor'

export default function PageClient({
    services: serverServices,
    notifications: serverNotifications,
    tags: serverTags,
}: { services: Service[], notifications: ServiceNotification[], tags: Tag[] }) {
    const [services, setServices] = useState<Service[]>(serverServices)
    const [notifications, setNotifications] = useState<ServiceNotification[]>(serverNotifications)
    const [tags, setTags] = useState<{ id: string, name: string }[]>(serverTags)
    const [input, setInput] = useState('')
    const [stateFilter, setStateFilter] = useState<string[] | null>(null)
    const [addingTag, setAddingTag] = useState(false)
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [selected, setSelected] = useState<Service | null>(null)
    const [adding, setAdding] = useState(false)
    const [editing, setEditing] = useState<Service | null>(null)
    const [refresh, setRefresh] = useState(false)
    const [refreshTags, setRefreshTags] = useState(false)
    const [refreshNotifications, setRefreshNotifications] = useState(false)

    function addNewService() {
        setAdding(true)
        setEditing(null)
    }

    function dashboard() {
        setAdding(false)
        setEditing(null)
        setSelected(null)
    }

    useEffect(() => {
        if (refresh) {
            (async () => {
                const response = await getServices()
                if (Array.isArray(response)) setServices(response)
            })()
        }
    }, [refresh])

    useEffect(() => {
        const interval = setInterval(async () => {
            const response = await getServices()
            if (Array.isArray(response)) setServices(response)
        }, 30000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (refreshTags) {
            (async () => {
                const response = await getTags()
                if (Array.isArray(response)) setTags(response)
            })()
        }
    }, [refreshTags])

    useEffect(() => {
        if (refreshNotifications) {
            (async () => {
                const response = await getNotifications()
                if (Array.isArray(response)) setNotifications(response)
            })()
        }
    }, [refreshNotifications])

    const filteredServices = services.filter(item => {
        if (input && !item.name.toLowerCase().includes(input.toLowerCase())) return false

        let status: 'up' | 'down' | 'maintenance' | 'pending' | null
        if (item.bars.length) {
            const lastBar = item.bars[item.bars.length - 1]
            status = lastBar.status ? 'up' : lastBar.expectedDown ? 'maintenance' : item.maxConsecutiveFailures > 0 ? 'pending' : 'down'
        } else {
            status = 'down'
        }

        if (stateFilter !== null && (!status || !stateFilter.includes(status))) return false
        if (selectedTags.length) {
            if (!selectedTags.some(tf => item.tags.some(it => it.name === tf))) return false
        }

        return true
    })

    const tableList = filteredServices.map(item => {
        let status: 'up' | 'down' | 'maintenance' | 'pending' | null
        if (item.bars.length) {
            const lastBar = item.bars[item.bars.length - 1]
            status = lastBar.status ? 'up' : lastBar.expectedDown ? 'maintenance' : item.maxConsecutiveFailures > 0 ? 'pending' : 'down'
        } else {
            status = 'down'
        }

        return {
            system_table_id: item.id,
            name: (
                <div className='block w-36 max-w-36 min-w-0 overflow-hidden' title={item.name}>
                    <Marquee
                        text={item.name}
                        className='w-full max-w-36'
                        innerClassName='font-medium text-white'
                    />
                </div>
            ),
            status: (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                    status === 'up' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        status === 'maintenance' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                            status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                    {status}
                </span>
            ),
            history: (
                <div className='flex gap-1 h-6 items-center'>
                    {item.bars.slice(5, item.bars.length).map((bar, index) => {
                        let barStat: 'up' | 'down' | 'maintenance' | 'pending' | null
                        if (item.enabled && bar.status) barStat = 'up'
                        else if (item.enabled && !bar.status && bar.expectedDown) barStat = 'maintenance'
                        else if (item.enabled && !bar.status && item.maxConsecutiveFailures > 0) barStat = 'pending'
                        else barStat = 'down'
                        return <div
                            key={index}
                            className={`w-1 lg:w-1.5 h-full rounded-full cursor-crosshair hover:scale-110
                                ${barColor(bar, item.maxConsecutiveFailures, barStat)}`}
                        />
                    }).toReversed()}
                </div>
            ),
            uptime: <span className='font-mono'>{Number(item.uptime).toFixed(0)}%</span>,
            tags: item.tags.map(t => t.name).join(', ') || '-',
        }
    })

    function openServiceStatus(id: string) {
        const nextSelected = services.find((item) => String(item.id) === id) || null
        setAdding(false)
        setEditing(null)
        setSelected(nextSelected)
    }

    return (
        <div className='h-full overflow-hidden flex gap-4 relative'>
            <div className='h-full overflow-hidden flex flex-col gap-4 relative w-full'>
                <NewTag
                    display={addingTag}
                    setAddingTag={setAddingTag}
                    setRefresh={setRefreshTags}
                />

                {(adding || editing) ? (
                    <div className='flex-1 overflow-y-auto w-full'>
                        <div className='flex flex-col gap-4 md:px-16 md:py-4'>
                            <BackButton onClick={dashboard} />
                            {adding && (
                                <ServiceForm
                                    mode='create'
                                    services={services}
                                    notifications={notifications}
                                    setRefresh={setRefresh}
                                    setAdding={setAdding}
                                    setSelected={setSelected}
                                />
                            )}
                            {editing && (
                                <ServiceForm
                                    mode='edit'
                                    service={editing}
                                    notifications={notifications}
                                    setRefresh={setRefresh}
                                    setEditing={setEditing}
                                    setSelected={setSelected}
                                />
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className='flex-none'>
                            <div className='flex w-full justify-between items-start md:items-center'>
                                <h1 className='text-lg font-semibold text-login-50'>Monitoring</h1>
                                <div
                                    className='flex flex-wrap items-center gap-4 rounded-2xl border border-white/5
                                        bg-transparent p-2 pt-2.5 pr-2.5'
                                >
                                    <Button text='Add new service' icon={<Plus className='w-4 h-4' />} onClick={addNewService} />
                                </div>
                            </div>
                        </div>

                        <Statistics services={services} />
                        <ServiceListHeader
                            stateFilter={stateFilter}
                            setStateFilter={setStateFilter}
                            tags={tags}
                            setAddingTag={setAddingTag}
                            setSelectedTags={setSelectedTags}
                            selectedTags={selectedTags}
                            input={input}
                            setInput={setInput}
                        />

                        <div className='flex-1 flex flex-col min-h-10 overflow-hidden'>
                            <Table
                                list={tableList}
                                headers={['name', 'status', 'history', 'uptime', 'tags']}
                                hideMenu={true}
                                onRowClick={openServiceStatus}
                            />
                        </div>
                    </>
                )}
            </div>
            {!editing && !adding && (
                <div className='w-2/3 h-full max-h-full overflow-auto'>
                    <ServiceStatus
                        service={!selected ? services[0] : services.find((s) => s.name === selected?.name)}
                        onEdit={setEditing}
                    />
                </div>
            )}
        </div>
    )
}
