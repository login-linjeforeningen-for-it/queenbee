'use client'

import EditService from '@components/status/editService'
import NewService from '@components/status/newService'
import NewTag from '@components/status/newTag'
import NotificationList from '@components/status/notificationList'
import ServiceListHeader from '@components/status/serviceListHeader'
import ServiceStatus from '@components/status/serviceStatus'
import Statistics from '@components/status/statistics'
import getNotifications from '@utils/api/beekeeper/services/getNotifications'
import getServices from '@utils/api/beekeeper/services/getServices'
import getTags from '@utils/api/beekeeper/services/getTags'
import { TriangleAlert, Plus, Activity, Edit, X, Columns, Square } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button, Toggle } from 'uibee/components'
import Table from '@components/table/table'
import Marquee from '@components/shared/marquee'
import barColor from '@utils/status/barColor'
import { setCookie } from 'utilbee'

export default function PageClient({
    services: serverServices,
    notifications: serverNotifications,
    tags: serverTags,
    compressed: serverCompressed
}: { services: Service[], notifications: ServiceNotification[], tags: Tag[], compressed: boolean }) {
    const [services, setServices] = useState<Service[]>(serverServices)
    const [notifications, setNotifications] = useState<ServiceNotification[]>(serverNotifications)
    const [service, setService] = useState<Service | null>(null)
    const [tags, setTags] = useState<{ id: string, name: string }[]>(serverTags)
    const [input, setInput] = useState('')
    const [stateFilter, setStateFilter] = useState<string[] | null>(null)
    const [activeFilter, setActiveFilter] = useState<boolean | null>(null)
    const [addingTag, setAddingTag] = useState(false)
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [selected, setSelected] = useState<Service | null>(null)
    const [adding, setAdding] = useState(false)
    const [editing, setEditing] = useState<Service | null>(null)
    const [refresh, setRefresh] = useState(false)
    const [refreshTags, setRefreshTags] = useState(false)
    const [refreshNotifications, setRefreshNotifications] = useState(false)
    const [viewNotifications, setViewNotifications] = useState(false)
    const [compressed, setCompressed] = useState(serverCompressed)

    function addNewService() {
        setAdding(true)
        setEditing(null)
        setService(null)
        setViewNotifications(false)
    }

    function handleViewNotifications() {
        setAdding(false)
        setEditing(null)
        setSelected(null)
        setViewNotifications(true)
    }

    function dashboard() {
        setAdding(false)
        setEditing(null)
        setSelected(null)
        setViewNotifications(false)
    }

    useEffect(() => {
        if (refresh) {
            (async () => {
                const response = await getServices()
                if (Array.isArray(response)) {
                    setServices(response)
                }
            })()
        }
    }, [refresh])

    useEffect(() => {
        const interval = setInterval(async () => {
            const response = await getServices()
            if (Array.isArray(response)) {
                setServices(response)
            }
        }, 30000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (refreshTags) {
            (async () => {
                const response = await getTags()
                if (Array.isArray(response)) {
                    setTags(response)
                }
            })()
        }
    }, [refreshTags])

    useEffect(() => {
        if (refreshNotifications) {
            (async () => {
                const response = await getNotifications()
                if (Array.isArray(response)) {
                    setNotifications(response)
                }
            })()
        }
    }, [refreshNotifications])

    const filteredServices = services.filter(item => {
        if (input && !item.name.toLowerCase().includes(input.toLowerCase())) return false
        if (activeFilter !== null && item.enabled !== activeFilter) return false

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
                    {item.bars.slice((compressed ? 5 : 0), item.bars.length).map((bar, index) => {
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
            actions: (
                <div className='flex gap-2 justify-end' onClick={(e) => { e.stopPropagation(); e.preventDefault() }}>
                    <button
                        type='button'
                        onClick={() => setSelected(item)}
                        className='p-1.5 hover:bg-white/10 rounded-lg transition-colors group'
                    >
                        <Activity className='w-4 h-4 text-muted-foreground group-hover:text-login-200' />
                    </button>
                    <button
                        type='button'
                        onClick={() => setEditing(item)}
                        className='p-1.5 hover:bg-white/10 rounded-lg transition-colors group'>
                        <Edit className='w-4 h-4 text-muted-foreground group-hover:text-login-200' />
                    </button>
                </div>
            )
        }
    })

    function handleToggle() {
        setCompressed((prev) => {
            if (prev) {
                setSelected(null)
            }

            setCookie('monitoringCompressed', prev ? 'false' : 'true')
            return !prev
        })
    }

    return (
        <div className='h-full overflow-hidden flex gap-4 relative'>
            <div className='h-full overflow-hidden flex flex-col gap-4 relative w-full'>
                <NewTag
                    display={addingTag}
                    setAddingTag={setAddingTag}
                    setRefresh={setRefreshTags}
                />

                {(adding || editing || (selected && !compressed) || viewNotifications) ? (
                    <div className='flex-1 overflow-y-auto w-full'>
                        <div className='flex flex-col gap-4 md:px-16 md:py-4'>
                            <div className='flex justify-start w-full'>
                                <Button
                                    text='Back to list'
                                    icon={<X className='w-4 h-4' />}
                                    variant='secondary'
                                    onClick={dashboard}
                                />
                            </div>
                            {adding && (
                                <NewService
                                    services={services}
                                    service={service}
                                    setService={setService}
                                    notifications={notifications}
                                    setRefresh={setRefresh}
                                    setAdding={setAdding}
                                    setSelected={setSelected}
                                    setRefreshNotifications={setRefreshNotifications}
                                />
                            )}
                            {editing && (
                                <EditService
                                    notifications={notifications}
                                    setRefresh={setRefresh}
                                    setRefreshNotifications={setRefreshNotifications}
                                    service={editing}
                                    setEditing={setEditing}
                                    setSelected={setSelected}
                                />
                            )}
                            {selected && !editing && !compressed && (
                                <ServiceStatus service={services.find((s) => s.name === selected?.name)} />
                            )}
                            {viewNotifications && (
                                <NotificationList notifications={notifications} />
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className='flex-none'>
                            <div className='flex w-full justify-between items-start md:items-center'>
                                <div className='flex gap-2 items-center'>
                                    <h1 className='font-semibold text-lg'>Monitoring</h1>
                                </div>
                                <div className='flex flex-wrap gap-4 items-center pt-0.5 pr-0.5'>
                                    <Button text='Add new service' icon={<Plus className='w-4 h-4' />} onClick={addNewService} />
                                    <Button
                                        text='Notifications'
                                        variant='secondary'
                                        icon={<TriangleAlert className='w-4 h-4' />}
                                        onClick={handleViewNotifications}
                                    />
                                    <Toggle
                                        value={compressed}
                                        onChange={handleToggle}
                                        left={{ value: true, icon: <Columns className='h-4.5 w-4.5' />, label: 'Compressed' }}
                                        right={{ value: false, icon: <Square className='h-4.5 w-4.5' />, label: 'Single View' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <Statistics services={services} />
                        <ServiceListHeader
                            stateFilter={stateFilter}
                            setStateFilter={setStateFilter}
                            activeFilter={activeFilter}
                            setActiveFilter={setActiveFilter}
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
                                headers={['name', 'status', 'history', 'uptime', 'tags', 'actions']}
                                hideMenu={true}
                            />
                        </div>
                    </>
                )}
            </div>
            {compressed && !editing && !adding && (
                <div className='w-2/3 h-full max-h-full overflow-auto'>
                    <ServiceStatus service={!selected ? services[0] : services.find((s) => s.name === selected?.name)} />
                </div>
            )}
        </div>
    )
}
