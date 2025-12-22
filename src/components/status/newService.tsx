import { Dispatch, SetStateAction, useState } from 'react'
import NewNotification from './newNotification'
import { Plus } from 'lucide-react'
import postService from '@utils/fetch/status/postService'

type NewServiceProps = {
    notifications: ServiceNotification[]
    setRefresh: Dispatch<SetStateAction<boolean>>
    setRefreshNotifications: Dispatch<SetStateAction<boolean>>
}

export default function NewService({ notifications, setRefresh, setRefreshNotifications }: NewServiceProps) {
    const [addingNotification, setAddingNotification] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const initialForm = {
        name: '',
        type: 'fetch',
        url: '',
        interval: 60,
        status: false,
        expectedDown: false,
        notification: null,
        maxConsecutiveFailures: 0,
        note: '',
        enabled: true,
    }

    const [form, setForm] = useState<NewService>(initialForm)

    function updateField<K extends keyof typeof form>(key: K, value: typeof form[K]) {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    function clearForm() {
        setForm(initialForm)
    }

    function isValid() {
        if (!form.name || !form.type || !form.url || !form.interval ||
            form.maxConsecutiveFailures == null || !form.note
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
        } else {
            setError('Unable to reach server. Please try again later.')
        }
    }

    return (
        <div className='w-full space-y-4'>
            <NewNotification
                display={addingNotification}
                setAddingNotification={setAddingNotification}
                setRefresh={setRefreshNotifications}
            />
            <h1 className='text-xl font-semibold'>New Service</h1>

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
                            className='w-full rounded bg-white/10 px-3 py-2'
                            value={form.type}
                            onChange={(e) => updateField('type', e.target.value as 'fetch' | 'post')}
                        >
                            <option value='fetch'>Fetch</option>
                            <option value='post'>Post</option>
                        </select>
                    </div>
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
                    {/* Max Consecutive Failures */}
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
                        value={form.note}
                        onChange={(e) => updateField('note', e.target.value)}
                    />
                </div>

                {/* Booleans */}
                <div className='space-y-2'>
                    <label className='flex items-center gap-2'>
                        <input
                            type='checkbox'
                            checked={form.expectedDown}
                            onChange={(e) => updateField('expectedDown', e.target.checked)}
                        />
                        Expected down
                    </label>

                    <label className='flex items-center gap-2'>
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
                        value={form.type}
                        onChange={(e) => updateField('type', e.target.value as 'fetch' | 'post')}
                    >
                        {notifications.map((notification) =>
                            <option key={notification.name} value={notification.name}>{notification.name}</option>
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
                <button
                    type='submit'
                    className={`
                        rounded-lg bg-login/80 outline outline-login
                        hover:bg-login/90 px-4 py-0.5 font-medium
                        hover:brightness-110
                    `}
                >
                    Create Service
                </button>
            </form>
        </div>
    )
}
