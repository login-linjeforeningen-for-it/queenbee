'use client'
import sendNotificationClient from '@utils/notification/sendNotificationClient'
import { useEffect, useRef, useState } from 'react'
import { CalendarClock, File, Flag, RefreshCcw, Send, SendHorizontal, Trash2 } from 'lucide-react'
import Preview from '@components/preview/preview'
import { Button, ConfirmPopup, Input, toast } from 'uibee/components'
import normalizeScreenPayload from '@components/nucleus/normalizeScreenPayload'
import setExample from '@components/nucleus/example'

const SENDS_TO_TOPIC = 'This pushes to every phone subscribed to the topic.'

type PendingConfirm = { header: string, description: string, confirmText: string, run: () => Promise<void> }

export default function page() {
    const formRef = useRef<HTMLFormElement>(null)
    const [history, setHistory] = useState<AppNotificationHistoryEntry[]>([])
    const [scheduled, setScheduled] = useState<ScheduledAppNotificationEntry[]>([])
    const [loadingHistory, setLoadingHistory] = useState(false)
    const [loadingScheduled, setLoadingScheduled] = useState(false)
    const [resendingId, setResendingId] = useState<string | null>(null)
    const [sendingScheduledId, setSendingScheduledId] = useState<string | null>(null)
    const [deletingScheduledId, setDeletingScheduledId] = useState<string | null>(null)
    const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(null)
    const [formValues, setFormValues] = useState({
        title: '' as string,
        description: '' as string,
        topic: '' as string | number,
        screen: '' as string | number,
        scheduledAt: '' as string,
    })

    async function handleSend(formData: FormData) {
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const topic = formData.get('topic') as string
        const screen = formData.get('screen') as string

        if (topic === 'example') {
            toast.error('Example values should not be sent!')
            return
        }

        const response = await sendNotificationClient({
            title,
            description,
            screen,
            topic,
        })

        if (response) {
            if (response.status === 200) {
                toast.success(response.message)
                await loadHistory()
            } else {
                toast.error(response.message)
            }
        }
    }

    useEffect(() => {
        void loadHistory()
        void loadScheduled()
    }, [])

    async function loadHistory() {
        setLoadingHistory(true)
        try {
            const response = await fetch('/api/notification/history?limit=12', { cache: 'no-store' })
            const payload = await response.json()
            if (response.ok) {
                setHistory(payload)
            }
        } finally {
            setLoadingHistory(false)
        }
    }

    async function loadScheduled() {
        setLoadingScheduled(true)
        try {
            const response = await fetch('/api/notification/scheduled?limit=12', { cache: 'no-store' })
            const payload = await response.json()
            if (response.ok) {
                setScheduled(payload)
            }
        } finally {
            setLoadingScheduled(false)
        }
    }

    async function handleResend(id: string) {
        setResendingId(id)
        try {
            const response = await fetch(`/api/notification/resend/${id}`, { method: 'POST' })
            if (!response.ok) {
                toast.error('Resend failed. Try again.')
                return
            }
            toast.success('Notification resent')
            await loadHistory()
        } finally {
            setResendingId(null)
        }
    }

    async function handleSchedule(formData: FormData) {
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const topic = formData.get('topic') as string
        const screen = formData.get('screen') as string
        const scheduledAt = formData.get('scheduledAt') as string
        const parsedDate = new Date(scheduledAt)

        if (!scheduledAt || Number.isNaN(parsedDate.getTime())) {
            toast.error('Choose a valid date and time before scheduling.')
            return
        }

        const response = await fetch('/api/notification/scheduled', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                body: description,
                topic,
                data: normalizeScreenPayload(screen),
                scheduledAt: parsedDate.toISOString(),
            }),
        })

        if (!response.ok) {
            const payload = await response.json().catch(() => ({ error: 'Failed to schedule notification' }))
            toast.error(`Schedule failed: ${JSON.stringify(payload.error)}`)
            return
        }

        toast.success('Notification scheduled!')
        await loadScheduled()
    }

    async function handleSendScheduledNow(id: string) {
        setSendingScheduledId(id)
        try {
            const response = await fetch(`/api/notification/scheduled/${id}/send`, { method: 'POST' })
            if (!response.ok) {
                toast.error('Sending failed. Try again.')
                return
            }
            toast.success('Notification sent')
            await Promise.all([loadScheduled(), loadHistory()])
        } finally {
            setSendingScheduledId(null)
        }
    }

    async function handleDeleteScheduled(id: string) {
        setDeletingScheduledId(id)
        try {
            const response = await fetch(`/api/notification/scheduled/${id}`, { method: 'DELETE' })
            if (!response.ok) {
                toast.error('Cancelling failed. Try again.')
                return
            }
            toast.success('Scheduled notification cancelled')
            await loadScheduled()
        } finally {
            setDeletingScheduledId(null)
        }
    }

    const listPanelClass = [
        'flex flex-col overflow-hidden',
        'xl:h-full xl:max-h-[calc(100vh-7rem)] xl:min-h-0',
        'rounded-2xl border border-white/5 bg-login-50/5 p-4',
    ].join(' ')

    function RecentNotifications() {
        return (
            <div className={listPanelClass}>
                <div className='mb-4 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <Flag className='h-4 w-4 text-login' />
                        <h2 className='text-sm font-semibold text-login-50'>Recent notifications</h2>
                    </div>
                    <button
                        type='button'
                        onClick={() => void loadHistory()}
                        className='flex cursor-pointer items-center gap-1.5 text-xs text-login-200 transition-colors hover:text-login-50'
                    >
                        <RefreshCcw className={`h-3.5 w-3.5 ${loadingHistory ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                <div className='grid min-h-0 flex-1 gap-2 overflow-y-auto pr-1'>
                    {history.length === 0 && (
                        <p className='text-sm text-login-200'>{loadingHistory ? 'Loading…' : 'No notifications sent yet.'}</p>
                    )}
                    {history.map((item) => (
                        <div
                            key={item.id}
                            className='rounded-xl border border-white/5 bg-login-50/5 p-3'
                        >
                            <div className='flex items-start justify-between gap-3'>
                                <div>
                                    <div className='text-sm font-semibold text-login-50'>{item.title}</div>
                                    <div className='mt-1 text-xs text-login-200'>{item.body}</div>
                                    <div className='mt-2 text-xs text-login-200'>
                                        {item.topic} · delivered {item.delivered} · failed {item.failed}
                                    </div>
                                </div>
                                <button
                                    type='button'
                                    onClick={() => setPendingConfirm({
                                        header: `Resend '${item.title}' to ${item.topic}?`,
                                        description: SENDS_TO_TOPIC,
                                        confirmText: 'Resend',
                                        run: () => handleResend(item.id),
                                    })}
                                    disabled={resendingId === item.id}
                                    className='flex shrink-0 cursor-pointer items-center gap-1 text-xs
                                        text-login transition-colors hover:text-login-200'
                                >
                                    {resendingId === item.id ? 'Sending…' : 'Resend'}
                                    <SendHorizontal className='h-3.5 w-3.5' />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    function ScheduledNotifications() {
        return (
            <div className={listPanelClass}>
                <div className='mb-4 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <CalendarClock className='h-4 w-4 text-login' />
                        <h2 className='text-sm font-semibold text-login-50'>Scheduled notifications</h2>
                    </div>
                    <button
                        type='button'
                        onClick={() => void loadScheduled()}
                        className='flex cursor-pointer items-center gap-1.5 text-xs text-login-200 transition-colors hover:text-login-50'
                    >
                        <RefreshCcw className={`h-3.5 w-3.5 ${loadingScheduled ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                <div className='grid min-h-0 flex-1 gap-2 overflow-y-auto pr-1'>
                    {scheduled.length === 0 && (
                        <p className='text-sm text-login-200'>
                            {loadingScheduled ? 'Loading…' : 'Nothing scheduled. Pick a date under "Schedule for" and press Schedule.'}
                        </p>
                    )}
                    {scheduled.map((item) => (
                        <div key={item.id} className='rounded-xl border border-white/5 bg-login-50/5 p-3'>
                            <div className='flex items-start justify-between gap-3'>
                                <div>
                                    <div className='text-sm font-semibold text-login-50'>{item.title}</div>
                                    <div className='mt-1 text-xs text-login-200'>{item.body}</div>
                                    <div className='mt-2 text-xs text-login-200'>
                                        {item.topic} · {item.status} · {new Date(item.scheduledAt).toLocaleString()}
                                    </div>
                                    {item.lastError && (
                                        <div className='mt-2 text-xs text-red-300'>{item.lastError}</div>
                                    )}
                                </div>
                                <div className='flex shrink-0 items-center gap-3'>
                                    <button
                                        type='button'
                                        onClick={() => setPendingConfirm({
                                            header: `Send '${item.title}' to ${item.topic} now?`,
                                            description: SENDS_TO_TOPIC,
                                            confirmText: 'Send now',
                                            run: () => handleSendScheduledNow(item.id),
                                        })}
                                        disabled={sendingScheduledId === item.id}
                                        className='flex cursor-pointer items-center gap-1 text-xs
                                            text-login transition-colors hover:text-login-200'
                                    >
                                        <SendHorizontal className='h-3.5 w-3.5' />
                                        {sendingScheduledId === item.id ? 'Sending…' : 'Send now'}
                                    </button>
                                    {item.status !== 'cancelled' && item.status !== 'sent' && (
                                        <button
                                            type='button'
                                            onClick={() => setPendingConfirm({
                                                header: `Cancel '${item.title}'?`,
                                                description: 'It will not be sent.',
                                                confirmText: 'Cancel notification',
                                                run: () => handleDeleteScheduled(item.id),
                                            })}
                                            disabled={deletingScheduledId === item.id}
                                            className='flex cursor-pointer items-center gap-1 text-xs
                                                text-red-400 transition-colors hover:text-red-300'
                                        >
                                            <Trash2 className='h-3.5 w-3.5' />
                                            {deletingScheduledId === item.id ? 'Cancelling…' : 'Cancel'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className='grid w-full grid-cols-1 gap-4 xl:grid-cols-3 xl:h-full xl:min-h-0 xl:overflow-hidden'>
            <div className='min-w-0 xl:min-h-0 xl:overflow-y-auto'>
                <div className='mb-4'>
                    <h1 className='flex min-h-9 items-center font-semibold text-lg'>Nucleus</h1>
                    <p className='text-sm text-login-200'>Send a notification to the Login App</p>
                </div>
                <form
                    ref={formRef}
                    onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        handleSend(formData)
                    }}
                    className='flex max-w-md flex-col'
                >
                    <Input
                        name='title'
                        type='text'
                        label='Title'
                        required
                        className=''
                        onChange={(e) =>
                            setFormValues({
                                ...formValues,
                                title: e.target.value,
                            })
                        }
                        value={formValues.title || ''}
                    />
                    <Input
                        name='description'
                        type='text'
                        label='Description'
                        required
                        className=''
                        onChange={(e) =>
                            setFormValues({
                                ...formValues,
                                description: e.target.value,
                            })
                        }
                        value={formValues.description || ''}
                    />
                    <Input
                        name='topic'
                        type='text'
                        label='Topic'
                        required
                        className=''
                        onChange={(e) =>
                            setFormValues({ ...formValues, topic: e.target.value })
                        }
                        value={formValues.topic || ''}
                    />
                    <Input
                        name='screen'
                        type='text'
                        label='Screen'
                        description='Use event:123, ad:456, ai, admin, login or notifications.'
                        className=''
                        onChange={(e) =>
                            setFormValues({ ...formValues, screen: e.target.value })
                        }
                        value={formValues.screen || ''}
                    />
                    <Input
                        name='scheduledAt'
                        type='datetime-local'
                        label='Schedule for'
                        className=''
                        onChange={(e) =>
                            setFormValues({ ...formValues, scheduledAt: e.target.value })
                        }
                        value={formValues.scheduledAt || ''}
                    />
                    <div className='mb-4'>
                        <Preview title={formValues.title} description={formValues.description} />
                    </div>
                    <div className='flex flex-wrap items-center justify-between gap-2'>
                        <div className='flex justify-between gap-2'>
                            <Button
                                variant='secondary'
                                text='Example'
                                icon='+'
                                onClick={() => setExample(setFormValues)}
                            />
                            <Button
                                variant='secondary'
                                icon={<File className='w-5' />}
                                path='/nucleus/documentation'
                                text='Documentation'
                            />
                        </div>
                        <div className='flex gap-2'>
                            <Button
                                variant='secondary'
                                icon={<CalendarClock className='w-5' />}
                                text='Schedule'
                                type='button'
                                onClick={() => {
                                    if (formRef.current) {
                                        void handleSchedule(new FormData(formRef.current))
                                    }
                                }}
                            />
                            <Button icon={<Send className='w-5' />} text='Send' type='submit' />
                        </div>
                    </div>
                </form>
            </div>
            <div className='min-w-0 xl:min-h-0'>
                {ScheduledNotifications()}
            </div>
            <div className='min-w-0 xl:min-h-0'>
                {RecentNotifications()}
            </div>
            <ConfirmPopup
                isOpen={pendingConfirm !== null}
                header={pendingConfirm?.header ?? ''}
                description={pendingConfirm?.description}
                confirmText={pendingConfirm?.confirmText}
                onConfirm={() => {
                    void pendingConfirm?.run()
                    setPendingConfirm(null)
                }}
                onCancel={() => setPendingConfirm(null)}
            />
        </div>
    )
}
