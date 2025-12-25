import { Dispatch, SetStateAction, useState } from 'react'
import { Plus } from 'lucide-react'
import postService from '@utils/fetch/status/postService'
import { Button } from 'uibee/components'

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
                        <label className='block text-sm font-medium'>Name</label>
                        <input
                            type='text'
                            className='w-full rounded bg-login-50/5 px-3 py-2'
                            value={form.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            required
                        />
                    </div>

                    {/* Type */}
                    <div className='w-fit'>
                        <label className='block text-sm font-medium'>Type</label>
                        <select
                            className='w-full rounded bg-login-50/5 px-3 py-2 cursor-pointer'
                            value={form.type}
                            onChange={(e) => updateField('type', e.target.value as MonitoredServiceType)}
                        >
                            <option value='fetch'>Fetch</option>
                            <option value='post'>Post</option>
                            <option value='tcp'>TCP</option>
                        </select>
                    </div>

                    {/* Port */}
                    {form.type === 'tcp' && <div className='w-fit'>
                        <label className='block text-sm font-medium'>Port</label>
                        <input
                            type='number'
                            max={65565}
                            min={1}
                            className='w-full rounded bg-login-50/5 px-3 py-2'
                            value={form.port}
                            onChange={(e) => updateField('port', Number(e.target.value))}
                        />
                    </div>}
                </div>

                <div className='flex gap-2'>
                    {/* URL */}
                    <div className='w-1/2'>
                        <label className='block text-sm font-medium'>URL</label>
                        <input
                            type={form.type === 'tcp' ? 'text' : 'url'}
                            className='w-full rounded bg-login-50/5 px-3 py-2'
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
                        <label className='block text-sm font-medium'>Interval (seconds)</label>
                        <input
                            type='number'
                            min={1}
                            className='w-full rounded bg-login-50/5 px-3 py-2'
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
                            className='w-full rounded bg-login-50/5 px-3 py-2'
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
                            className='w-full rounded bg-login-50/5 px-3 py-2'
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
                        className='w-full rounded bg-login-50/5 px-3 py-2'
                        value={form.note}
                        onChange={(e) => updateField('note', e.target.value)}
                    />
                </div>

                {/* Booleans */}
                <div className='space-y-2'>
                    <label className='flex items-center gap-2 cursor-pointer'>
                        <input
                            className='cursor-pointer'
                            type='checkbox'
                            checked={form.expectedDown}
                            onChange={(e) => updateField('expectedDown', e.target.checked)}
                        />
                        Expected down
                    </label>

                    <label className='flex items-center gap-2 cursor-pointer'>
                        <input
                            className='cursor-pointer'
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
                        className='w-full rounded bg-login-50/5 px-3 py-2'
                        value={form.notification || 'None'}
                        onChange={(e) => updateField('notification', e.target.value)}
                    >
                        {notifications.map((notification) =>
                            <option key={notification.name} value={notification.id}>{notification.name}</option>
                        )}
                    </select>
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
