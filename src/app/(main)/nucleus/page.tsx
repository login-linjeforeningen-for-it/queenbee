'use client'
import sendNotificationClient from '@utils/notification/sendNotificationClient'
import { useEffect, useRef, useState } from 'react'
import { CalendarClock, File, Flag, RefreshCcw, Send, SendHorizontal, Trash2 } from 'lucide-react'
import Preview from '@components/preview/preview'
import { Button, Input } from 'uibee/components'
import normalizeScreenPayload from '@components/nucleus/normalizeScreenPayload'
import setExample from '@components/nucleus/example'

export default function page() {
    const formRef = useRef<HTMLFormElement>(null)
    const [result, setResult] = useState<SendResponseClient | null>()
    const [history, setHistory] = useState<AppNotificationHistoryEntry[]>([])
    const [scheduled, setScheduled] = useState<ScheduledAppNotificationEntry[]>([])
    const [loadingHistory, setLoadingHistory] = useState(false)
    const [loadingScheduled, setLoadingScheduled] = useState(false)
    const [resendingId, setResendingId] = useState<string | null>(null)
    const [sendingScheduledId, setSendingScheduledId] = useState<string | null>(null)
    const [deletingScheduledId, setDeletingScheduledId] = useState<string | null>(null)
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
        const response = await sendNotificationClient({
            title,
            description,
            screen,
            topic,
        })

        if (topic === 'example') {
            setResult({
                message: 'Example values should not be sent!',
                status: 500,
            })

            setTimeout(() => {
                setResult(null)
            }, 2000)

            return
        }

        if (response) {
            setResult(response)
            if (response.status === 200) {
                await loadHistory()
                setTimeout(() => {
                    setResult(null)
                }, 2000)
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
            if (response.ok) {
                await loadHistory()
            }
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
            setResult({
                status: 500,
                message: 'Choose a valid date and time before scheduling.',
            })
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
            setResult({
                status: 500,
                message: `Schedule failed: ${JSON.stringify(payload.error)}`,
            })
            return
        }

        setResult({
            status: 200,
            message: 'Notification scheduled!',
        })
        await loadScheduled()
    }

    async function handleSendScheduledNow(id: string) {
        setSendingScheduledId(id)
        try {
            const response = await fetch(`/api/notification/scheduled/${id}/send`, { method: 'POST' })
            if (response.ok) {
                await Promise.all([loadScheduled(), loadHistory()])
            }
        } finally {
            setSendingScheduledId(null)
        }
    }

    async function handleDeleteScheduled(id: string) {
        setDeletingScheduledId(id)
        try {
            const response = await fetch(`/api/notification/scheduled/${id}`, { method: 'DELETE' })
            if (response.ok) {
                await loadScheduled()
            }
        } finally {
            setDeletingScheduledId(null)
        }
    }

    function RecentNotifications() {
        return (
            <div className='rounded-2xl border border-login-100/10 bg-login-900/55 p-4'>
                <div className='mb-4 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <Flag className='h-4 w-4 text-login' />
                        <h2 className='text-sm font-semibold text-white'>Recent notifications</h2>
                    </div>
                    <button
                        type='button'
                        onClick={() => void loadHistory()}
                        className='flex cursor-pointer items-center gap-2 text-xs text-login-200'
                    >
                        <RefreshCcw className={`h-4 w-4 ${loadingHistory ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                <div className='grid gap-3'>
                    {history.map((item) => (
                        <div
                            key={item.id}
                            className='rounded-xl border border-login-100/10 bg-black/10 p-3'
                        >
                            <div className='flex items-start justify-between gap-3'>
                                <div>
                                    <div className='text-sm font-semibold text-white'>{item.title}</div>
                                    <div className='mt-1 text-xs text-login-200'>{item.body}</div>
                                    <div className='mt-2 text-[11px] uppercase tracking-[0.18em] text-login-200'>
                                        {item.topic} · delivered {item.delivered} · failed {item.failed}
                                    </div>
                                </div>
                                <button
                                    type='button'
                                    onClick={() => void handleResend(item.id)}
                                    className='flex cursor-pointer items-center gap-1 text-xs text-login'
                                >
                                    {resendingId === item.id ? 'Sending' : 'Resend'}
                                    <SendHorizontal className='h-4 w-4' />
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
            <div className='rounded-2xl border border-login-100/10 bg-login-900/55 p-4'>
                <div className='mb-4 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <CalendarClock className='h-4 w-4 text-login' />
                        <h2 className='text-sm font-semibold text-white'>Scheduled notifications</h2>
                    </div>
                    <button
                        type='button'
                        onClick={() => void loadScheduled()}
                        className='flex cursor-pointer items-center gap-2 text-xs text-login-200'
                    >
                        <RefreshCcw className={`h-4 w-4 ${loadingScheduled ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                <div className='grid gap-3'>
                    {scheduled.map((item) => (
                        <div key={item.id} className='rounded-xl border border-login-100/10 bg-black/10 p-3'>
                            <div className='flex items-start justify-between gap-3'>
                                <div>
                                    <div className='text-sm font-semibold text-white'>{item.title}</div>
                                    <div className='mt-1 text-xs text-login-200'>{item.body}</div>
                                    <div className='mt-2 text-[11px] uppercase tracking-[0.18em] text-login-200'>
                                        {item.topic} · {item.status} · {new Date(item.scheduledAt).toLocaleString()}
                                    </div>
                                    {item.lastError && (
                                        <div className='mt-2 text-xs text-red-300'>{item.lastError}</div>
                                    )}
                                </div>
                                <div className='flex items-center gap-2'>
                                    <button
                                        type='button'
                                        onClick={() => void handleSendScheduledNow(item.id)}
                                        className='flex cursor-pointer items-center gap-1 text-xs text-login'
                                    >
                                        <SendHorizontal className='h-4 w-4' />
                                        {sendingScheduledId === item.id ? 'Sending' : 'Send now'}
                                    </button>
                                    {item.status !== 'cancelled' && item.status !== 'sent' && (
                                        <button
                                            type='button'
                                            onClick={() => void handleDeleteScheduled(item.id)}
                                            className='flex cursor-pointer items-center gap-1 text-xs text-red-300'
                                        >
                                            <Trash2 className='h-4 w-4' />
                                            {deletingScheduledId === item.id ? 'Canceling' : 'Cancel'}
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
        <div className='grid h-full w-full gap-4 xl:grid-cols-[minmax(320px,420px)_minmax(300px,1fr)_minmax(300px,1fr)]'>
            <div className='min-w-0'>
                <div className='mb-8'>
                    <h1 className='text-2xl font-bold tracking-tight text-foreground'>
                        Nucleus
                    </h1>
                    <p className='text-muted-foreground text-base mt-1'>
                        Send a notification to the Login App
                    </p>
                </div>
                {result?.status && (
                    <div
                        className={`
                            rounded-md text-center mb-4 py-2 font-medium
                            ${result.status === 200 ? 'bg-green-500' : 'bg-red-500'}
                        `}
                    >
                        {result?.message}
                    </div>
                )}
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
                        label='Screen (optional)'
                        className=''
                        onChange={(e) =>
                            setFormValues({ ...formValues, screen: e.target.value })
                        }
                        value={formValues.screen || ''}
                    />
                    <p className='-mt-2 mb-2 text-xs text-login-200'>
                        Use `event:123`, `ad:456`, `ai`, `admin`, `login`, or `notifications`.
                    </p>
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
                    {formValues.title.length > 0 && (
                        <div className='relative z-200 mb-4 h-22 w-full xl:hidden'>
                            <Preview
                                small={true}
                                title={formValues.title}
                                description={formValues.description}
                            />
                        </div>
                    )}
                    <div className='mb-4 hidden xl:block'>
                        <Preview title={formValues.title} description={formValues.description} />
                    </div>
                    <div className='grid md:flex! items-center justify-between gap-2'>
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
                <div className='mt-4 xl:hidden'>
                    <ScheduledNotifications />
                </div>
                <div className='mt-4 xl:hidden'>
                    <RecentNotifications />
                </div>
            </div>
            <div className='hidden min-w-0 xl:block'>
                <ScheduledNotifications />
            </div>
            <div className='hidden min-w-0 xl:block'>
                <RecentNotifications />
            </div>
        </div>
    )
}
