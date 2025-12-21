import { useState } from 'react'
import NewNotification from './newNotification'
import { Plus } from 'lucide-react'

export default function NewService({ notifications }: { notifications: ServiceNotification[] }) {
    const [addingNotification, setAddingNotification] = useState(false)
    const [form, setForm] = useState({
        name: '',
        type: 'fetch',
        url: '',
        interval: 60,
        status: false,
        webhookUrl: '',
        expectedDown: false,
        maxConsecutiveFailures: 0,
        note: '',
        enabled: true,
    })

    function updateField<K extends keyof typeof form>(key: K, value: typeof form[K]) {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    function isValid() {
        if (!form.name || !form.type || !form.url || !form.interval ||
            !form.webhookUrl || form.maxConsecutiveFailures == null ||
            !form.note
        ) {
            return false
        }

        return true
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!isValid()) {
            return
        }


        try {
            const res = await fetch('/api/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })

            const data = await res.json()

            if (!res.ok) {
                console.error('Error creating service:', data.error)
                alert(`Error: ${data.error}`)
                return
            }

            alert(`Service "${form.name}" created successfully.`)
            setForm({
                name: '',
                type: 'fetch',
                url: '',
                interval: 60,
                status: false,
                webhookUrl: '',
                expectedDown: false,
                maxConsecutiveFailures: 0,
                note: '',
                enabled: true,
            })
        } catch (err) {
            console.error('Network error:', err)
            alert('Network error, please try again.')
        }
    }

    return (
        <div className='w-full space-y-4'>
            <NewNotification display={addingNotification} setAddingNotification={setAddingNotification} />
            <h1 className='text-xl font-semibold'>New Service</h1>

            <form className='space-y-4'>
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
                    {/* Webhook URL */}
                    <div className='w-1/2'>
                        <label className='block text-sm font-medium'>Webhook URL</label>
                        <input
                            type='url'
                            className='w-full rounded bg-white/10 px-3 py-2'
                            value={form.webhookUrl}
                            onChange={(e) => updateField('webhookUrl', e.target.value)}
                        />
                    </div>

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
                    Click <a className='text-blue-400 cursor-pointer' onClick={() => setAddingNotification(true)}>here</a> or the
                    plus icon next to 'Notifications' to add one.
                </h1>}

                {/* Submit */}
                <button
                    onSubmit={handleSubmit}
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
