import postNotification from '@utils/fetch/status/postNotification'
import { X } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import { Button, Input } from 'uibee/components'

type NewTagProps = {
    display: boolean
    setAddingNotification: Dispatch<SetStateAction<boolean>>
    setRefresh: Dispatch<SetStateAction<boolean>>
}

export default function NewNotification({ display, setAddingNotification, setRefresh }: NewTagProps) {
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    const [webhook, setWebhook] = useState('')
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        e.stopPropagation()

        if (!name) {
            return
        }

        const response = await postNotification({ name, message, webhook })
        if ('message' in response) {
            setName('')
            setMessage('')
            setWebhook('')
            setRefresh(true)
            setAddingNotification(false)
        } else {
            setError('Unable to reach server. Please try again later.')
        }
    }

    if (!display) {
        return
    }

    return (
        <div
            onClick={(e) => { e.stopPropagation(); setAddingNotification(false) }}
            className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
        >
            <form
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
                className='bg-login-50/5 backdrop-blur-md rounded-xl p-6 w-full max-w-md grid gap-4 text-white'
            >
                <h1 className='text-2xl font-semibold text-center'>New Notification</h1>

                <div className='grid gap-1'>
                    <Input
                        name='name'
                        label='Name'
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='beehive'
                        required
                    />
                </div>

                <div className='grid gap-1'>
                    <Input
                        name='message'
                        label='Message (@role Website down!)'
                        type='text'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder='@Frontend'
                    />
                </div>

                <div className='grid gap-1'>
                    <Input
                        name='webhook'
                        label='Webhook'
                        type='text'
                        value={webhook}
                        onChange={(e) => setWebhook(e.target.value)}
                        placeholder='discord.com/webhooks/abc/def'
                        required
                    />
                    {(!webhook.startsWith('https://') || webhook.includes('https://.') || !(webhook.includes('.com') || webhook.includes('.no')))
                        && <span className='text-sm text-red-500'>
                            Must include 'https://' and a valid top level domain (.com, .no)
                        </span>
                    }
                </div>

                {error && <span className='text-sm text-red-500'>{error}</span>}

                <div className='flex justify-end gap-2 pt-2'>
                    <Button
                        text='Cancel'
                        variant='secondary'
                        icon={<X className='w-5' />}
                        onClick={() => setAddingNotification(false)}
                    />
                    <Button type='submit' text='Create' icon='+' />
                </div>
            </form>
        </div>
    )
}
