'use client'

import EditService from '@components/status/editService'
import NewService from '@components/status/newService'
import NewTag from '@components/status/newTag'
import ServiceList from '@components/status/serviceList'
import ServiceListHeader from '@components/status/serviceListHeader'
import ServiceStatus from '@components/status/serviceStatus'
import Statistics from '@components/status/statistics'
import { getNotifications, getServices, getTags } from '@utils/api'
import { LayoutDashboard } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from 'uibee/components'

export default function PageClient({
    services: serverServices,
    notifications: serverNotifications,
    tags: serverTags
}: { services: Service[], notifications: ServiceNotification[], tags: Tag[] }) {
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

    return (
        <div className='grid lg:grid-cols-7 gap-2'>
            <NewTag
                display={addingTag}
                setAddingTag={setAddingTag}
                setRefresh={setRefreshTags}
            />
            <div className='col-span-3 flex gap-2'>
                <Button text='Add new service' icon='+' onClick={() => { setAdding(true); setEditing(null); setService(null) }} />
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

                <ServiceList
                    services={services}
                    input={input}
                    activeFilter={activeFilter}
                    stateFilter={stateFilter}
                    selectedTags={selectedTags}
                    setSelected={setSelected}
                    setAdding={setAdding}
                    setEditing={setEditing}
                />
            </div>
            <div className='col-span-4 rounded-lg grid gap-2 h-fit'>
                <Statistics services={services} />
                {adding
                    ? <NewService
                        services={services}
                        service={service}
                        setService={setService}
                        notifications={notifications}
                        setRefresh={setRefresh}
                        setAdding={setAdding}
                        setSelected={setSelected}
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
