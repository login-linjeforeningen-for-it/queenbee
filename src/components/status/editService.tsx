import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import NewNotification from './newNotification'
import { Copy, Plus, RefreshCcw } from 'lucide-react'
import putService from '@utils/fetch/status/putService'
import { getService } from '@utils/api'
import TrashShift from './trashShift'
import { Button } from 'uibee/components'
import config from '@config'
import useClearStateAfter from '@/hooks/useClearStateAfter'
import deleteService from '@utils/fetch/status/deleteService'

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
    const copyText = `${config.beekeeper.api}${config.beekeeper.status.services.post}/${service.id}`
    const initialForm = {
        id: service.id,
        name: service.name,
        type: 'fetch' as 'fetch' | 'post',
        url: 'Loading...',
        interval: 60,
        status: false,
        notification: null,
        expectedDown: false,
        userAgent: null,
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
        if (!form.name || !form.type || (form.type === 'fetch' && !form.url) || !form.interval ||
            form.maxConsecutiveFailures === null
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
                interval: response.interval,
                notification: String(response.notification),
                userAgent: response.userAgent,
                maxConsecutiveFailures: Number(response.maxConsecutiveFailures) || 0,
                note: response.note,
                tags: response.tags,
                type: response.type as 'fetch' | 'post',
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
                        <label className='block text-sm font-medium'>Name</label>
                        <input
                            type='text'
                            className='w-full rounded bg-white/10 px-3 py-2'
                            value={form.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            required
                        />
                    </div>

                    {/* Type */}
                    <div className='w-fit'>
                        <label className='block text-sm font-medium'>Type</label>
                        <select
                            className='w-full rounded bg-white/10 px-3 py-2 cursor-pointer'
                            value={form.type}
                            onChange={(e) => updateField('type', e.target.value as 'fetch' | 'post')}
                        >
                            <option value='fetch'>Fetch</option>
                            <option value='post'>Post</option>
                        </select>
                    </div>

                    {form.type === 'post' && <div className='w-fit'>
                        <label className='block text-sm font-medium'>Send updates to</label>
                        <h1
                            className='w-full rounded bg-white/10 px-3 py-2 flex gap-2 cursor-pointer text-login-100'
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
                        <label className='block text-sm font-medium'>URL</label>
                        <input
                            type='url'
                            className='w-full rounded bg-white/10 px-3 py-2'
                            value={form.url}
                            onChange={(e) => updateField('url', e.target.value)}
                        />
                        {((!form.url.startsWith('https://') && !form.url.startsWith('http://')) || form.url.includes('https://.')
                            || !(form.url.includes('.com') || form.url.includes('.no')))
                            && <span className='text-xs text-red-500'>
                                Must include 'http(s)://' and a valid top level domain (.com, .no)
                            </span>
                        }
                    </div>

                    {/* Interval */}
                    <div className='w-fit'>
                        <label className='block text-sm font-medium'>Interval (seconds)</label>
                        <input
                            type='number'
                            min={1}
                            className='w-full rounded bg-white/10 px-3 py-2'
                            value={form.interval}
                            onChange={(e) => updateField('interval', Number(e.target.value))}
                            required
                        />
                    </div>
                </div>

                <div className='flex gap-2'>
                    {/* User Agent */}
                    <div className='w-1/2'>
                        <label className='block text-sm font-medium'>User Agent</label>
                        <input
                            type='text'
                            className='w-full rounded bg-white/10 px-3 py-2'
                            value={form.userAgent || ''}
                            onChange={(e) => updateField('userAgent', e.target.value)}
                        />
                    </div>

                    {/* Max consecutive failures */}
                    <div className='w-fit'>
                        <label className='block text-sm font-medium'>
                            Max Consecutive Failures
                        </label>
                        <input
                            type='number'
                            min={0}
                            className='w-full rounded bg-white/10 px-3 py-2'
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
                    <label className='block text-sm font-medium'>Note</label>
                    <textarea
                        className='w-full rounded bg-white/10 px-3 py-2'
                        value={form.note || ''}
                        onChange={(e) => updateField('note', e.target.value)}
                    />
                </div>

                {/* Booleans */}
                <div className='space-y-2'>
                    <label className='flex items-center gap-2 cursor-pointer'>
                        <input
                            type='checkbox'
                            checked={form.expectedDown}
                            onChange={(e) => updateField('expectedDown', e.target.checked)}
                        />
                        Expected down
                    </label>

                    <label className='flex items-center gap-2 cursor-pointer'>
                        <input
                            type='checkbox'
                            checked={form.enabled}
                            onChange={(e) => updateField('enabled', e.target.checked)}
                        />
                        Enabled
                    </label>
                </div>

                <div className='w-fit'>
                    <div className='flex justify-between items-center'>
                        <label className='block text-sm font-medium'>Notification</label>
                        <Plus onClick={() => setAddingNotification(true)} className='w-4 h-4 cursor-pointer hover:stroke-login' />
                    </div>
                    <select
                        className='w-full rounded bg-white/10 px-3 py-2'
                        value={form.notification || 'None'}
                        onChange={(e) => updateField('notification', e.target.value)}
                    >
                        <option value=''>None</option>
                        {notifications.map((notification) =>
                            <option key={notification.name} value={notification.id}>{notification.name}</option>
                        )}
                    </select>
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
