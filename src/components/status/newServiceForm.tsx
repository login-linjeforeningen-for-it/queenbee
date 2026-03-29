import { Dispatch, SetStateAction, useState } from 'react'
import { Plus } from 'lucide-react'
import postService from '@utils/fetch/status/postService'
import { Button, Input, Select, Textarea, Switch } from 'uibee/components'

type NewServiceFormProps = {
    form: NewService
    setForm: Dispatch<SetStateAction<NewService>>
    service: Service | null
    notifications: ServiceNotification[]
    clearForm: () => void
    setRefresh: Dispatch<SetStateAction<boolean>>
    setService: Dispatch<SetStateAction<Service | null>>
    setAddingNotification: Dispatch<SetStateAction<boolean>>
}

export default function NewServiceForm({
    form,
    setForm,
    service,
    notifications,
    clearForm,
    setRefresh,
    setService,
    setAddingNotification
}: NewServiceFormProps) {
    const [error, setError] = useState<string | null>(null)

    function updateField<K extends keyof typeof form>(key: K, value: typeof form[K]) {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    function isValid() {
        if (!form.name || !form.type || (form.type === 'fetch' && !form.url)
            || !form.interval || form.maxConsecutiveFailures == null
            || (form.type === 'tcp' && !form.port)
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

        const response = await postService(form)
        if (typeof response === 'object' && 'message' in response) {
            clearForm()
            setRefresh(true)
            if (form.type === 'post') {
                setService(response)
            }
        } else {
            setError('Unable to reach server. Please try again later.')
        }
    }

    if (service) {
        return
    }

    return (
        <>
            <h1 className='text-xl font-semibold'>New Service</h1>

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
                            max={65565}
                            min={1}
                            value={form.port}
                            onChange={(e) => updateField('port', Number(e.target.value))}
                        />
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
                    No notifications are set up. Services can be created without, but if they go down, no alert will be sent.<br />
                    Click <a className='text-blue-400 cursor-pointer select-none' onClick={() => setAddingNotification(true)}>here</a> or
                    the plus icon next to 'Notifications' to add one.
                </h1>}

                {error?.length && <h1 className='text-sm text-red-500'>{error}</h1>}

                {/* Submit */}
                <Button type='submit' icon='+' text='Create Service' />
            </form>
        </>
    )
}
