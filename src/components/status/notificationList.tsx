import { getNotifications } from '@utils/api'
import deleteNotification from '@utils/fetch/status/deleteNotification'
import postNotification from '@utils/fetch/status/postNotification'
import putNotification from '@utils/fetch/status/putNotification'
import { Save, Trash, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from 'uibee/components'

export default function NotificationList({ notifications: serverNotifications }: { notifications: ServiceNotification[] }) {
    const [notifications, setNotifications] = useState(serverNotifications)
    const initialForm = {
        id: 0,
        name: '',
        message: '',
        webhook: ''
    }
    const [form, setForm] = useState<ServiceNotification>(initialForm)
    const [adding, setAdding] = useState(false)
    const [editing, setEditing] = useState(false)

    function resetForm() {
        setForm(initialForm)
        setAdding(false)
        setEditing(false)
    }

    function updateField<K extends keyof typeof form>(key: K, value: typeof form[K]) {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    async function handleDelete() {
        const response = await deleteNotification(form.id)
        if ('message' in response) {
            resetForm()
            setEditing(false)
        }
    }

    async function handleAdd(e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>) {
        e.preventDefault()
        e.stopPropagation()

        if (!adding) {
            setAdding(true)
            return
        }

        const response = await postNotification({ ...form })
        if ('message' in response) {
            resetForm()
            setAdding(false)
        }
    }

    async function handleEdit(notification: ServiceNotification) {
        setForm(notification)
        setEditing(true)
    }

    async function handleSubmit(e: React.MouseEvent<HTMLFormElement>) {
        e.preventDefault()
        e.stopPropagation()
        const response = await putNotification({ ...form })
        if ('message' in response) {
            resetForm()
            setEditing(false)
        }
    }

    useEffect(() => {
        (async() => {
            const newNotifications = await getNotifications()
            if (Array.isArray(newNotifications)) {
                setNotifications(newNotifications)
            }
        })()
    }, [adding, editing])

    if (editing) {
        return (
            <form onSubmit={handleSubmit} className='space-y-2'>
                <div className='flex justify-between'>
                    <h1 className='text-lg font-semibold'>Editing {form.name}</h1>
                    <Button icon={<Trash className='w-5' />} color='secondary' text='Delete' onClick={handleDelete} />
                </div>
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
                </div>

                <div className='flex gap-2'>
                    {/* Message */}
                    <div className='w-1/2'>
                        <label className='block text-sm font-medium'>Message</label>
                        <input
                            type='text'
                            className='w-full rounded bg-white/10 px-3 py-2'
                            value={form.message}
                            onChange={(e) => updateField('message', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className='flex gap-2'>
                    {/* Webhook */}
                    <div className='w-1/2'>
                        <label className='block text-sm font-medium'>Webhook</label>
                        <input
                            type='text'
                            className='w-full rounded bg-white/10 px-3 py-2'
                            value={form.webhook}
                            onChange={(e) => updateField('webhook', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className='flex gap-2'>
                    <Button onClick={resetForm} color='secondary' icon={<X className='w-5' />} text='Cancel' />
                    <Button type='submit' icon={<Save className='w-5' />} text='Save' />
                </div>
            </form>
        )
    }

    if (adding) {
        return (
            <form onSubmit={handleAdd} className='space-y-2'>
                <h1 className='text-lg font-semibold'>Adding notification {form.name}</h1>
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
                </div>

                <div className='flex gap-2'>
                    {/* Message */}
                    <div className='w-1/2'>
                        <label className='block text-sm font-medium'>Message</label>
                        <input
                            type='text'
                            className='w-full rounded bg-white/10 px-3 py-2'
                            value={form.message}
                            onChange={(e) => updateField('message', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className='flex gap-2'>
                    {/* Webhook */}
                    <div className='w-1/2'>
                        <label className='block text-sm font-medium'>Webhook</label>
                        <input
                            type='text'
                            className='w-full rounded bg-white/10 px-3 py-2'
                            value={form.webhook}
                            onChange={(e) => updateField('webhook', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className='flex gap-2'>
                    <Button onClick={resetForm} color='secondary' icon={<X className='w-5' />} text='Cancel' />
                    <Button type='submit' icon='+' text='Add Notification' />
                </div>
            </form>
        )
    }

    return (
        <table className='table-auto w-full border-collapse overflow-hidden'>
            <thead>
                <tr className='bg-white/10 font-semibold'>
                    <th className='px-4 py-2 text-left rounded-tl-lg'>ID</th>
                    <th className='px-4 py-2 text-left'>Name</th>
                    <th className='px-4 py-2 text-left'>Message</th>
                    <th className='px-4 py-2 text-left rounded-tr-lg flex justify-between items-center'>
                        <h1>Webhook</h1>
                        <h1 onClick={handleAdd} className='rounded cursor-pointer px-2 bg-white/10 hover:bg-white/20'>+</h1>
                    </th>
                </tr>
            </thead>
            <tbody>
                {notifications.map((notification) => (
                    <tr
                        key={notification.id}
                        onClick={() => handleEdit(notification)}
                        className='bg-white/5 border-b border-white/5 hover:bg-white/5 cursor-pointer'
                    >
                        <td className='px-4 py-2'>{notification.id}</td>
                        <td className='px-4 py-2'>{notification.name}</td>
                        <td className='px-4 py-2'>{notification.message}</td>
                        <td className='px-4 py-2 max-w-xs wrap-break-word'>{notification.webhook}</td>
                    </tr>
                ))}
            </tbody>
        </table>

    )
}
