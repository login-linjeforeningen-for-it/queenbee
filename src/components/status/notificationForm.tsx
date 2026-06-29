'use client'

import Form from 'next/form'
import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, toast } from 'uibee/components'
import { Save } from 'lucide-react'

type FormState = string | { success: true } | null

type Props = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: (prev: any, formData: FormData) => Promise<FormState>
    defaultValues?: { id: number; name: string; message: string; webhook: string }
}

export default function NotificationForm({ action, defaultValues }: Props) {
    const [state, dispatch, pending] = useActionState(action, null)
    const router = useRouter()

    useEffect(() => {
        if (state === null) return
        if (typeof state === 'string') {
            toast.error(state)
        } else {
            toast.success('Notification saved!')
            router.push('/internal/monitoring/notifications')
        }
    }, [state])

    return (
        <Form action={dispatch} className='flex flex-col gap-6 mt-6'>
            {defaultValues && <input type='hidden' name='id' value={defaultValues.id} />}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <Input
                    name='name'
                    label='Name'
                    type='text'
                    defaultValue={defaultValues?.name ?? ''}
                    required
                />
                <Input
                    name='message'
                    label='Message'
                    type='text'
                    defaultValue={defaultValues?.message ?? ''}
                    required
                />
                <div className='md:col-span-2'>
                    <Input
                        name='webhook'
                        label='Webhook URL'
                        type='url'
                        defaultValue={defaultValues?.webhook ?? ''}
                        required
                    />
                </div>
            </div>
            <div>
                <Button
                    type='submit'
                    icon={<Save className='w-4 h-4' />}
                    text={defaultValues ? 'Save changes' : 'Create notification'}
                    disabled={pending}
                />
            </div>
        </Form>
    )
}
