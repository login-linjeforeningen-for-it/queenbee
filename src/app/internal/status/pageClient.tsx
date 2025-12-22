'use client'

import EditService from '@components/status/editService'
import MultiSelect from '@components/status/multiSelect'
import NewService from '@components/status/newService'
import NewTag from '@components/status/newTag'
import ServiceRow from '@components/status/serviceRow'
import ServiceStatus from '@components/status/serviceStatus'
import Statistics from '@components/status/statistics'
import { getNotifications, getServices, getTags } from '@utils/api'
import { LayoutDashboard, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from 'uibee/components'

export default function PageClient({
    services: serverServices,
    notifications: serverNotifications,
    tags: serverTags
}: { services: Service[], notifications: ServiceNotification[], tags: Tag[] }) {
    const [services, setServices] = useState<Service[]>(serverServices)
    const [notifications, setNotifications] = useState<ServiceNotification[]>(serverNotifications)
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

    function addTag(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
        e.preventDefault()
        e.stopPropagation()
        setAddingTag(true)
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

    return (
        <div className='grid lg:grid-cols-7 gap-2'>
            <NewTag display={addingTag} setAddingTag={setAddingTag} setRefresh={setRefreshTags} />
            <div className='col-span-3 flex gap-2'>
                <Button text='Add new service' icon='+' onClick={() => { setAdding(true); setEditing(null) }} />
                <Button
                    text='Dashboard'
                    color='secondary'
                    icon={<LayoutDashboard />}
                    onClick={() => { setAdding(false); setEditing(null); setSelected(null) }}
                />
            </div>
            <div className='col-span-4'>
                <h1 className='text-xl font-semibold'>Statistics</h1>
            </div>
            <div className='col-span-3 bg-white/10 p-2 rounded-lg grid gap-2 max-w-full h-fit'>
                {/* left side */}
                <div className='flex gap-2 h-fit'>
                    <MultiSelect
                        options={[
                            { label: 'Up', value: 'up' },
                            { label: 'Down', value: 'down' },
                            { label: 'Pending', value: 'pending' },
                            { label: 'Maintenance', value: 'maintenance' }
                        ]}
                        value={stateFilter ?? []}
                        onChange={(values: string[]) => setStateFilter(values.length ? values : null)}
                        placeholder='Status'
                    />
                    <select
                        className='px-2 py-0.5 rounded-lg '
                        value={activeFilter === null ? '' : String(activeFilter)}
                        onChange={(e) =>
                            setActiveFilter(
                                e.target.value === '' ? null : e.target.value === 'true'
                            )
                        }
                    >
                        <option value=''>All</option>
                        <option value='true'>Active</option>
                        <option value='false'>Inactive</option>
                    </select>
                    <MultiSelect
                        options={tags.map((tag) => ({
                            label: tag.name,
                            value: tag.name,
                        }))}
                        value={selectedTags}
                        onChange={setSelectedTags}
                        placeholder='Tags'
                        plusAction={addTag}
                    />
                    <div className='flex rounded-lg bg-white/10 outline outline-white/20 items-center px-2 w-fit'>
                        <Search className='h-4 w-4' />
                        <input
                            placeholder='Search..'
                            className='w-full rounded-lg px-2'
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>
                </div>

                <div className='grid gap-2 h-fit'>
                    {services.filter(item => {
                        if (!item.name.includes(input)) {
                            return false
                        }

                        if (activeFilter !== null && item.enabled !== activeFilter) {
                            return false
                        }

                        if (stateFilter !== null) {
                            if (!item.bars.length) return false

                            const lastBar = item.bars[item.bars.length - 1]
                            const status =
                                lastBar.status
                                    ? 'up'
                                    : lastBar.expectedDown
                                        ? 'maintenance'
                                        : item.maxConsecutiveFailures > 0
                                            ? 'pending'
                                            : 'down'

                            if (!stateFilter.includes(status)) return false
                        }

                        if (selectedTags.length) {
                            if (!selectedTags.some(tf =>
                                item.tags.some(it => it.id === Number(tf))
                            )) return false
                        }

                        return true
                    }).map((item, index) =>
                        <ServiceRow
                            onClick={() => { setSelected(item); setAdding(false); setEditing(null) }}
                            onEditClick={() => { setEditing(item); setSelected(null); setAdding(false) }}
                            key={index}
                            service={item}
                            uptime={item.uptime}
                            bars={item.bars}
                        />
                    )}
                </div>
            </div>
            <div className='col-span-4 rounded-lg grid gap-2 h-fit'>
                <Statistics services={services} />
                {adding
                    ? <NewService
                        notifications={notifications}
                        setRefresh={setRefresh}
                        setRefreshNotifications={setRefreshNotifications}
                    />
                    : editing ? null : <ServiceStatus service={services.find((service) => service.name === selected?.name)} />
                }
                {editing && <EditService
                    notifications={notifications}
                    setRefresh={setRefresh}
                    setRefreshNotifications={setRefreshNotifications}
                    service={editing}
                    setEditing={setEditing}
                    setSelected={setSelected}
                />}
            </div>
        </div>
    )
}
