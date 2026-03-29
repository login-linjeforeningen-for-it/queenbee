import NewNotification from './newNotification'
import putService from '@utils/fetch/status/putService'
import TrashShift from './trashShift'
import config from '@config'
import useClearStateAfter from '@/hooks/useClearStateAfter'
import deleteService from '@utils/fetch/status/deleteService'
import getService from '@utils/api/beekeeper/services/getService'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Copy, Plus, RefreshCcw } from 'lucide-react'
import { Button, Input, Select, Textarea, Switch } from 'uibee/components'

type EditServiceProps = {
    notifications: ServiceNotification[]
    setRefresh: Dispatch<SetStateAction<boolean>>
    setRefreshNotifications: Dispatch<SetStateAction<boolean>>
    service: Service
    setEditing: Dispatch<SetStateAction<Service | null>>
    setSelected: Dispatch<SetStateAction<Service | null>>
}

export default function EditService({
    notifications,
    setRefresh,
    setRefreshNotifications,
    service,
    setEditing,
    setSelected
}: EditServiceProps) {
    const [addingNotification, setAddingNotification] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { condition: copy, setCondition: setCopy } = useClearStateAfter({ timeout: 500 })
    const copyText = `${config.beekeeper.api}/${config.beekeeper.status.services.post}/${service.id}`
    const initialForm = {
        id: service.id,
        name: service.name,
        type: 'fetch' as MonitoredServiceType,
        url: 'Loading...',
        interval: 60,
        status: false,
        notification: null,
        expectedDown: false,
        upsideDown: false,
        userAgent: null,
        port: service.port || 22,
        maxConsecutiveFailures: 0,
        uptime: 0,
        tags: [{ id: 0, name: 'Loading...' }],
        note: 'Loading...',
        enabled: true,
        bars: [] as { status: Bar; date: string; message: string; }[]
    }

    const [form, setForm] = useState<NewService>(initialForm)

    function updateField<K extends keyof typeof form>(key: K, value: typeof form[K]) {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    function clearForm() {
        setForm(initialForm)
    }

    function isValid() {
        if (!form.name || !form.type || (form.type === 'fetch' && !form.url) ||
            !form.interval || form.maxConsecutiveFailures === null
        ) {
            return false
        }

        return true
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        e.stopPropagation()

        if (!isValid()) {
            return
        }

        const response = await putService(service.id, form)
        if (typeof response === 'object' && 'message' in response) {
            clearForm()
            setRefresh(true)
            setEditing(null)
            setSelected(service)
        } else {
            setError('Unable to reach server. Please try again later.')
        }
    }

    async function handleDelete(e: React.FormEvent) {
        e.preventDefault()
        e.stopPropagation()

        const response = await deleteService(service.id)
        if ('message' in response) {
            clearForm()
            setRefresh(true)
            setEditing(null)
        }
    }

    useEffect(() => {
        (async () => {
            const response = await getService(service.id)
            if (typeof response === 'string') {
                return setError('Unable to reach server.')
            }

            const updatedForm = {
                ...form,
                enabled: response.enabled,
                expectedDown: response.expectedDown,
                upsideDown: response.upsideDown,
                interval: response.interval,
                notification: String(response.notification),
                userAgent: response.userAgent,
                maxConsecutiveFailures: Number(response.maxConsecutiveFailures) || 0,
                note: response.note,
                tags: response.tags,
                type: response.type as MonitoredServiceType,
                url: response.url
            }

            setForm(updatedForm)
        })()
    }, [service])

    return (
        <div className='w-full space-y-4'>
            <NewNotification
                display={addingNotification}
                setAddingNotification={setAddingNotification}
                setRefresh={setRefreshNotifications}
            />
            <h1 className='text-xl font-semibold'>Editing {service.name}</h1>

            <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='flex gap-2'>
                    {/* Name */}
                    <div className='w-1/2'>
                        <Input
                            name='name'
                            label='Name'
                            type='text'
                            value={form.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            required
                        />
                    </div>

                    {/* Type */}
                    <div className='w-fit'>
                        <Select
                            name='type'
                            label='Type'
                            value={form.type}
                            onChange={(val) => updateField('type', val as MonitoredServiceType)}
                            options={[
                                { value: 'fetch', label: 'Fetch' },
                                { value: 'post', label: 'Post' },
                                { value: 'tcp', label: 'TCP' }
                            ]}
                        />
                    </div>

                    {/* Port */}
                    {form.type === 'tcp' && <div className='w-fit'>
                        <Input
                            name='port'
                            label='Port'
                            type='number'
                            value={form.port || 22}
                            onChange={(e) => updateField('port', Number(e.target.value))}
                        />
                    </div>}

                    {form.type === 'post' && <div className='w-fit'>
                        <label className='block text-sm font-medium'>Send updates to</label>
                        <h1
                            className='w-full rounded bg-login-50/5 px-3 py-2 flex gap-2 cursor-pointer text-login-100'
                            onClick={() => { setCopy(true); navigator.clipboard.writeText(copyText) }}
                        >
                            <Copy className={`w-5 text-login-50 ${copy && 'stroke-green-500'}`} />
                            {copyText}
                        </h1>
                    </div>}
                </div>

                <div className='flex gap-2'>
                    {/* URL */}
                    <div className='w-1/2'>
                        <Input
                            name='url'
                            label='URL'
                            type={form.type === 'tcp' ? 'text' : 'url'}
                            value={form.url}
                            onChange={(e) => updateField('url', e.target.value)}
                        />
                        {(form.type === 'fetch' && !form.url.startsWith('https://') && !form.url.startsWith('http://')) && !form.url.startsWith('https://.')
                            && !(form.url.includes('.com') && form.url.includes('.no'))
                            && <span className='text-xs text-red-500'>
                                Must include 'http(s)://' and a valid top level domain (.com, .no)
                            </span>
                        }
                        {(form.type === 'tcp' && !form.url.includes('/') && !form.url.includes('.com') && !form.url.includes('.no'))
                            && <span className='text-xs text-red-500'>
                                Must include a valid top level domain (.com, .no) without any path.
                            </span>
                        }
                    </div>

                    {/* Interval */}
                    <div className='w-fit'>
                        <Input
                            name='interval'
                            label='Interval (seconds)'
                            type='number'
                            min={1}
                            value={form.interval}
                            onChange={(e) => updateField('interval', Number(e.target.value))}
                            required
                        />
                    </div>
                </div>

                <div className='flex gap-2'>
                    {/* User Agent */}
                    <div className='w-1/2'>
                        <Input
                            name='userAgent'
                            label='User Agent'
                            type='text'
                            value={form.userAgent || ''}
                            onChange={(e) => updateField('userAgent', e.target.value)}
                        />
                    </div>

                    {/* Max consecutive failures */}
                    <div className='w-fit'>
                        <Input
                            name='maxConsecutiveFailures'
                            label='Max Consecutive Failures'
                            type='number'
                            min={0}
                            value={form.maxConsecutiveFailures}
                            onChange={(e) =>
                                updateField('maxConsecutiveFailures', Number(e.target.value))
                            }
                            required
                        />
                    </div>
                </div>

                {/* Note */}
                <div>
                    <Textarea
                        name='note'
                        label='Note'
                        value={form.note || ''}
                        onChange={(e) => updateField('note', e.target.value)}
                    />
                </div>

                {/* Booleans */}
                <div className='space-y-2'>
                    <Switch
                        name='expectedDown'
                        label='Expected down'
                        checked={form.expectedDown}
                        onChange={(e) => updateField('expectedDown', e.target.checked)}
                        switchOnly
                    />

                    <Switch
                        name='upsideDown'
                        label='Upside down'
                        checked={form.upsideDown}
                        onChange={(e) => updateField('upsideDown', e.target.checked)}
                        switchOnly
                    />

                    <Switch
                        name='enabled'
                        label='Enabled'
                        checked={form.enabled}
                        onChange={(e) => updateField('enabled', e.target.checked)}
                        switchOnly
                    />
                </div>

                <div className='w-fit'>
                    <div className='flex justify-between items-center mb-1'>
                        <label className='block text-sm font-medium'>Notification</label>
                        <Plus onClick={() => setAddingNotification(true)} className='w-4 h-4 cursor-pointer hover:stroke-login' />
                    </div>
                    <Select
                        name='notification'
                        value={form.notification || ''}
                        onChange={(val) => updateField('notification', val as string)}
                        options={[
                            { value: '', label: 'None' },
                            ...notifications.map((notification) => ({ value: notification.id, label: notification.name }))
                        ]}
                    />
                </div>

                {!notifications.length && <h1 className='text-sm text-red-500'>
                    No notifications are set up. If it goes down no alert will be sent.<br />
                    Click <a className='text-blue-400 cursor-pointer select-none' onClick={() => setAddingNotification(true)}>here</a> or
                    the plus icon next to 'Notifications' to add one.
                </h1>}

                {error?.length && <h1 className='text-sm text-red-500'>{error}</h1>}

                {/* Submit */}
                <div className='flex justify-between items-center'>
                    <Button type='submit' icon={<RefreshCcw />} text='Update Service' />
                    <TrashShift handleDelete={handleDelete} />
                </div>
            </form>
        </div>
    )
}
