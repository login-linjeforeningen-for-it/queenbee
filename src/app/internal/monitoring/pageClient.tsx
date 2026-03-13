'use client'

import EditService from '@components/status/editService'
import NewService from '@components/status/newService'
import NewTag from '@components/status/newTag'
import NotificationList from '@components/status/notificationList'
import ServiceList from '@components/status/serviceList'
import ServiceListHeader from '@components/status/serviceListHeader'
import ServiceStatus from '@components/status/serviceStatus'
import Statistics from '@components/status/statistics'
import getNotifications from '@utils/api/beekeeper/services/getNotifications'
import getServices from '@utils/api/beekeeper/services/getServices'
import getTags from '@utils/api/beekeeper/services/getTags'
import { LayoutDashboard, TriangleAlert } from 'lucide-react'
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
    const [viewNotifications, setViewNotifications] = useState(false)

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

    return (
        <div className='grid lg:grid-cols-7 gap-2'>
            <NewTag
                display={addingTag}
                setAddingTag={setAddingTag}
                setRefresh={setRefreshTags}
            />
            <div className='col-span-3 md:flex! grid gap-2'>
                <Button text='Add new service' icon='+' onClick={addNewService} />
                <div className='flex gap-2'>
                    <Button
                        text='Notifications'
                        variant='secondary'
                        icon={<TriangleAlert />}
                        onClick={handleViewNotifications}
                    />
                    <Button
                        text='Dashboard'
                        variant='secondary'
                        icon={<LayoutDashboard />}
                        onClick={dashboard}
                    />
                </div>
            </div>
            <div className='col-span-4'>
                <h1 className='text-xl font-semibold'>Statistics</h1>
            </div>
            <div className='col-span-3 bg-login-50/5 p-2 rounded-lg grid gap-2 max-w-full h-fit'>
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
                    setViewNotifications={setViewNotifications}
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
                {viewNotifications && <NotificationList notifications={notifications} />}
            </div>
        </div>
    )
}
