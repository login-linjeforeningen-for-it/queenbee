'use client'

import Link from 'next/link'
import putService from '@utils/fetch/status/putService'
import postService from '@utils/fetch/status/postService'
import deleteService from '@utils/fetch/status/deleteService'
import getService from '@utils/api/beekeeper/services/getService'
import TrashShift from './trashShift'
import WebhookConfirm from './webhookConfirm'
import config from '@config'
import useClearStateAfter from '@/hooks/useClearStateAfter'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Bell, Copy, Plus, RefreshCcw, SlidersHorizontal } from 'lucide-react'
import { Button, Input, Select, Textarea, Switch } from 'uibee/components'

type BaseProps = {
    notifications: ServiceNotification[]
    setRefresh: Dispatch<SetStateAction<boolean>>
    setSelected: Dispatch<SetStateAction<Service | null>>
}

type CreateProps = BaseProps & {
    mode: 'create'
    services: Service[]
    setAdding: Dispatch<SetStateAction<boolean>>
}

type EditProps = BaseProps & {
    mode: 'edit'
    service: Service
    setEditing: Dispatch<SetStateAction<Service | null>>
}

type ServiceFormProps = CreateProps | EditProps

const emptyForm: NewService = {
    name: '',
    type: 'fetch' as MonitoredServiceType,
    url: '',
    interval: 60,
    userAgent: null,
    expectedDown: false,
    upsideDown: false,
    notification: null,
    maxConsecutiveFailures: 0,
    port: 22,
    note: '',
    enabled: true,
}

function editInitialForm(service: Service): NewService {
    return {
        name: service.name,
        type: 'fetch' as MonitoredServiceType,
        url: 'Loading...',
        interval: 60,
        notification: null,
        expectedDown: false,
        upsideDown: false,
        userAgent: null,
        port: service.port || 22,
        maxConsecutiveFailures: 0,
        note: 'Loading...',
        enabled: true,
    }
}

export default function ServiceForm(props: ServiceFormProps) {
    const { notifications, setRefresh, setSelected } = props
    const isEdit = props.mode === 'edit'
    const service = isEdit ? props.service : null
    const serviceId = service?.id ?? null

    const copyText = isEdit
        ? `${config.beekeeper.api}/${config.beekeeper.status.services.post}/${serviceId}`
        : ''
    const { condition: copy, setCondition: setCopy } = useClearStateAfter({ timeout: 500 })

    const [error, setError] = useState<string | null>(null)
    const [createdService, setCreatedService] = useState<Service | null>(null)
    const [form, setForm] = useState<NewService>(isEdit ? editInitialForm(service!) : emptyForm)

    function updateField<K extends keyof typeof form>(key: K, value: typeof form[K]) {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    function clearForm() {
        setForm(isEdit ? editInitialForm(service!) : emptyForm)
    }

    function isValid() {
        if (!form.name || !form.type || (form.type === 'fetch' && !form.url) ||
            !form.interval || form.maxConsecutiveFailures === null ||
            (form.type === 'tcp' && !form.port)
        ) return false
        return true
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (!isValid()) return

        if (isEdit) {
            const response = await putService(service!.id, form)
            if (typeof response === 'object' && 'message' in response) {
                clearForm()
                setRefresh(true)
                props.setEditing(null)
                setSelected(service!)
            } else {
                setError('Unable to reach server. Please try again later.')
            }
        } else {
            const response = await postService(form)
            if (typeof response === 'object' && 'message' in response) {
                clearForm()
                setRefresh(true)
                if (form.type === 'post') setCreatedService(response)
            } else {
                setError('Unable to reach server. Please try again later.')
            }
        }
    }

    async function handleDelete(e: React.FormEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (!isEdit) return
        const response = await deleteService(service!.id)
        if ('message' in response) {
            clearForm()
            setRefresh(true)
            props.setEditing(null)
        }
    }

    async function handleCloseWebhook() {
        if (!isEdit && createdService) {
            const { services, setAdding } = props as CreateProps
            setRefresh(true)
            const found = services.find((s) => s.id === createdService.id)
            if (found) {
                setSelected(found)
                setAdding(false)
            } else {
                const fetched = await getService(createdService.id)
                if (fetched && typeof fetched !== 'string') {
                    setSelected(fetched)
                    setAdding(false)
                }
            }
        }
    }

    useEffect(() => {
        if (serviceId === null) return
        ;(async () => {
            const response = await getService(serviceId)
            if (typeof response === 'string') return setError('Unable to reach server.')
            setForm((prev) => ({
                ...prev,
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
                url: response.url,
            }))
        })()
    }, [serviceId])

    if (!isEdit && createdService) {
        return <WebhookConfirm service={createdService} onClick={handleCloseWebhook} />
    }

    return (
        <div className='w-full'>
            <h1 className='font-semibold text-lg md:text-2xl text-login-50'>
                {isEdit ? `Edit ${service!.name}` : 'New service'}
            </h1>

            <form onSubmit={handleSubmit} className='flex flex-col gap-6 mt-6'>
                <div className='grid grid-cols-2 gap-x-8'>
                    <Input
                        name='name'
                        label='Name'
                        type='text'
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        required
                    />
                    <div className='flex gap-4'>
                        <div className='flex-1'>
                            <Select
                                name='type'
                                label='Type'
                                value={form.type}
                                onChange={(val) => updateField('type', val as MonitoredServiceType)}
                                options={[
                                    { value: 'fetch', label: 'Fetch' },
                                    { value: 'post', label: 'Post' },
                                    { value: 'tcp', label: 'TCP' },
                                ]}
                            />
                        </div>
                        {form.type === 'tcp' && (
                            <div className='w-24'>
                                <Input
                                    name='port'
                                    label='Port'
                                    type='number'
                                    max={65565}
                                    min={1}
                                    value={form.port || 22}
                                    onChange={(e) => updateField('port', Number(e.target.value))}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* POST: copy webhook URL (edit only, create shows it post-submit via WebhookConfirm) */}
                {isEdit && form.type === 'post' && (
                    <div>
                        <div className='mb-1 text-[10px] font-semibold uppercase tracking-wider text-login-300'>
                            Send updates to
                        </div>
                        <div
                            onClick={() => { setCopy(true); navigator.clipboard.writeText(copyText) }}
                            className='flex cursor-pointer items-center gap-2 rounded bg-login-50/5
                                px-3 py-2 text-sm text-login-50 hover:bg-login-50/10'
                        >
                            <Copy className={`w-4 h-4 shrink-0 ${copy ? 'stroke-green-400' : 'text-login-300'}`} />
                            <span className='font-mono text-xs break-all'>{copyText}</span>
                        </div>
                    </div>
                )}

                <div className='grid grid-cols-2 gap-x-8'>
                    <div>
                        <Input
                            name='url'
                            label='URL'
                            type={form.type === 'tcp' ? 'text' : 'url'}
                            value={form.url}
                            onChange={(e) => updateField('url', e.target.value)}
                        />
                        {form.type === 'fetch' && form.url && !form.url.startsWith('http') && (
                            <p className='mt-1 text-xs text-red-300'>Must include http(s):// and a valid domain.</p>
                        )}
                        {form.type === 'tcp' && form.url && !form.url.includes('.') && (
                            <p className='mt-1 text-xs text-red-300'>Must include a valid domain without path.</p>
                        )}
                    </div>
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

                <div className='grid grid-cols-2 gap-x-8'>
                    <Input
                        name='userAgent'
                        label='User Agent'
                        type='text'
                        value={form.userAgent || ''}
                        onChange={(e) => updateField('userAgent', e.target.value)}
                    />
                    <Input
                        name='maxConsecutiveFailures'
                        label='Max Consecutive Failures'
                        type='number'
                        min={0}
                        value={form.maxConsecutiveFailures}
                        onChange={(e) => updateField('maxConsecutiveFailures', Number(e.target.value))}
                        required
                    />
                </div>

                <Textarea
                    name='note'
                    label='Note'
                    value={form.note || ''}
                    onChange={(e) => updateField('note', e.target.value)}
                />

                <div>
                    <div className='mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-login-300'>
                        <SlidersHorizontal className='h-3.5 w-3.5' />
                        Options
                    </div>
                    <div className='space-y-2'>
                        <Switch name='expectedDown' label='Expected down' checked={form.expectedDown}
                            onChange={(e) => updateField('expectedDown', e.target.checked)} switchOnly />
                        <Switch name='upsideDown' label='Upside down' checked={form.upsideDown}
                            onChange={(e) => updateField('upsideDown', e.target.checked)} switchOnly />
                        <Switch name='enabled' label='Enabled' checked={form.enabled}
                            onChange={(e) => updateField('enabled', e.target.checked)} switchOnly />
                    </div>
                </div>

                <div>
                    <div className='mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-login-300'>
                        <Bell className='h-3.5 w-3.5' />
                        Notification
                        <Link href='/internal/monitoring/notifications/create' className='ml-1'>
                            <Plus className='h-3.5 w-3.5 hover:stroke-login' />
                        </Link>
                    </div>
                    <div className='w-64'>
                        <Select
                            name='notification'
                            value={form.notification || ''}
                            onChange={(val) => updateField('notification', val as string)}
                            options={[
                                { value: '', label: 'None' },
                                ...notifications.map((n) => ({ value: n.id, label: n.name })),
                            ]}
                        />
                    </div>
                    {!notifications.length && (
                        <p className='mt-2 text-xs text-red-300'>
                            No notifications set up, no alert will be sent if this goes down.{' '}
                            <Link href='/internal/monitoring/notifications/create' className='text-login-400 hover:text-login-300'>
                                Add one
                            </Link>.
                        </p>
                    )}
                </div>

                {error && (
                    <p className='rounded-lg border border-red-500/20 bg-red-500/8 p-3 text-sm text-red-300'>{error}</p>
                )}

                <div className={isEdit ? 'flex items-center justify-between' : ''}>
                    <Button
                        type='submit'
                        icon={isEdit ? <RefreshCcw className='w-4 h-4' /> : '+'}
                        text={isEdit ? 'Update service' : 'Create service'}
                    />
                    {isEdit && <TrashShift handleDelete={handleDelete} />}
                </div>
            </form>
        </div>
    )
}
