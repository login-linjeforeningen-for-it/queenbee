'use client'

import EditService from '@components/status/editService'
import MultiSelect from '@components/status/multiSelect'
import NewService from '@components/status/newService'
import NewTag from '@components/status/newTag'
import ServiceRow from '@components/status/serviceRow'
import ServiceStatus from '@components/status/serviceStatus'
import Statistics from '@components/status/statistics'
import { getNotifications, getServices, getTags } from '@utils/api'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function PageClient({
    services: serverServices,
    notifications: serverNotifications,
    tags: serverTags
}: { services: Service[], notifications: ServiceNotification[], tags: Tag[] }) {
    const [services, setServices] = useState<Service[]>(serverServices)
    const [notifications, setNotifications] = useState<ServiceNotification[]>(serverNotifications)
    const [tags, setTags] = useState<{ id: string, name: string }[]>(serverTags)
    const [input, setInput] = useState('')
    const [stateFilter, setStateFilter] = useState<Bar[] | null>(null)
    const [enabledFilter, setEnabledFilter] = useState<boolean | null>(null)
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
                <h1 onClick={() => { setAdding(true); setEditing(null) }} className={`
                    bg-login/80 outline outline-login/80 px-8 py-0.5 select-none
                    hover:bg-login hover:outline-login hover:brightness-110 rounded-lg
                    w-fit cursor-pointer
                `}>Add new service</h1>
                <h1 onClick={() => { setAdding(false); setEditing(null); setSelected(null) }} className={`
                    bg-white/20 outline outline-white/40 px-8 py-0.5 select-none
                    hover:bg-white/40 hover:outline-white/60 hover:brightness-110 rounded-lg
                    w-fit cursor-pointer
                `}>Dashboard</h1>
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
                            { label: 'Pending', value: 'pending' }
                        ]}
                        value={stateFilter ?? []}
                        onChange={(values: string[]) => setStateFilter(values.length ? (values as Bar[]) : null)}
                        placeholder='Status'
                    />
                    <select
                        className='px-2 py-0.5 rounded-lg '
                        value={enabledFilter === null ? '' : String(enabledFilter)}
                        onChange={(e) =>
                            setEnabledFilter(
                                e.target.value === '' ? null : e.target.value === 'true'
                            )
                        }
                    >
                        <option value=''>Active</option>
                        <option value='true'>Enabled</option>
                        <option value='false'>Disabled</option>
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
                    {services.filter(item =>
                        item.name.includes(input)
                            && stateFilter === null ? true
                            : (item.bars.length ? stateFilter?.includes(item.bars[item.bars.length - 1].status) : false)
                                && enabledFilter === null ? true : enabledFilter === item.enabled
                                    && !selectedTags.length ? true : selectedTags!.some(tf => item.tags.some(it => it.id === Number(tf)))
                    ).map((item, index) =>
                        <ServiceRow
                            onClick={() => { setSelected(item); setAdding(false); setEditing(null) }}
                            onEditClick={() => { setEditing(item); setSelected(null); setAdding(false) }}
                            key={index}
                            name={item.name}
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
                />}
            </div>
        </div>
    )
}
