import getNotifications from '@utils/api/beekeeper/services/getNotifications'
import deleteNotification from '@utils/fetch/status/deleteNotification'
import postNotification from '@utils/fetch/status/postNotification'
import putNotification from '@utils/fetch/status/putNotification'
import { Save, Trash, X, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button, Input } from 'uibee/components'

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function handleAdd(e?: React.SubmitEvent<HTMLFormElement> | React.MouseEvent<HTMLElement> | any) {
        e?.preventDefault()
        e?.stopPropagation()

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

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        e.stopPropagation()
        const response = await putNotification({ ...form })
        if ('message' in response) {
            resetForm()
            setEditing(false)
        }
    }

    useEffect(() => {
        (async () => {
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
                    <Button
                        icon={<Trash className='w-5' />}
                        variant='secondary'
                        text='Delete'
                        onClick={handleDelete}
                    />
                </div>
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
                </div>

                <div className='flex gap-2'>
                    {/* Message */}
                    <div className='w-1/2'>
                        <Input
                            name='message'
                            label='Message'
                            type='text'
                            value={form.message}
                            onChange={(e) => updateField('message', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className='flex gap-2'>
                    {/* Webhook */}
                    <div className='w-1/2'>
                        <Input
                            name='webhook'
                            label='Webhook'
                            type='text'
                            value={form.webhook}
                            onChange={(e) => updateField('webhook', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className='flex gap-2'>
                    <Button
                        onClick={resetForm}
                        variant='secondary'
                        icon={<X className='w-5' />}
                        text='Cancel'
                    />
                    <Button
                        type='submit'
                        icon={<Save className='w-5' />}
                        text='Save'
                    />
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
                        <Input
                            name='name'
                            label='Name'
                            type='text'
                            value={form.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className='flex gap-2'>
                    {/* Message */}
                    <div className='w-1/2'>
                        <Input
                            name='message'
                            label='Message'
                            type='text'
                            value={form.message}
                            onChange={(e) => updateField('message', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className='flex gap-2'>
                    {/* Webhook */}
                    <div className='w-1/2'>
                        <Input
                            name='webhook'
                            label='Webhook'
                            type='text'
                            value={form.webhook}
                            onChange={(e) => updateField('webhook', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className='flex gap-2'>
                    <Button
                        onClick={resetForm}
                        variant='secondary'
                        icon={<X className='w-5' />}
                        text='Cancel'
                    />
                    <Button
                        type='submit'
                        icon='+'
                        text='Add Notification'
                    />
                </div>
            </form>
        )
    }

    return (
        <div className='flex flex-col gap-4 bg-login-50/5 p-4 rounded-xl border border-white/5'>
            <div className='flex justify-between items-center'>
                <h2 className='text-xl font-semibold'>Notifications</h2>
                <Button onClick={handleAdd} icon={<Plus className='w-4 h-4' />} text='Add notification' />
            </div>

            <div className='overflow-x-auto rounded-lg border border-white/5'>
                <table className='w-full text-sm text-left'>
                    <thead className='text-xs text-muted-foreground uppercase bg-black/20'>
                        <tr>
                            <th className='px-4 py-3 font-medium'>ID</th>
                            <th className='px-4 py-3 font-medium'>Name</th>
                            <th className='px-4 py-3 font-medium'>Message</th>
                            <th className='px-4 py-3 font-medium'>Webhook</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-white/5'>
                        {notifications.map((notification) => (
                            <tr
                                key={notification.id}
                                onClick={() => handleEdit(notification)}
                                className='hover:bg-white/5 cursor-pointer transition-colors'
                            >
                                <td className='px-4 py-3'>{notification.id}</td>
                                <td className='px-4 py-3 font-medium text-foreground'>{notification.name}</td>
                                <td className='px-4 py-3 text-muted-foreground'>{notification.message}</td>
                                <td className='px-4 py-3 text-muted-foreground break-all max-w-xs'>{notification.webhook}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
