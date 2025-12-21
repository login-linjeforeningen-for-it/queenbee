import { postNotification } from '@utils/api'
import { Dispatch, SetStateAction, useState } from 'react'

type NewTagProps = {
    display: boolean
    setAddingNotification: Dispatch<SetStateAction<boolean>>
}

export default function NewNotification({ display, setAddingNotification }: NewTagProps) {
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

        const response = await postNotification(name, message, webhook)
        if (!response.includes('failed')) {
            setName('')
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
                className='bg-white/10 backdrop-blur-md rounded-xl p-6 w-full max-w-md grid gap-4 text-white'
            >
                <h1 className='text-2xl font-semibold text-center'>New Notification</h1>

                <div className='grid gap-1'>
                    <label className='font-medium'>Name</label>
                    <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='beehive'
                        className='px-3 py-2 rounded-md bg-white/10 outline outline-white/20 focus:outline-blue-500'
                        required
                    />
                </div>

                <div className='grid gap-1'>
                    <label className='font-medium flex gap-2'>Message <h1 className='text-white/30'>(@role Website down!)</h1></label>
                    <input
                        type='text'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder='@Frontend'
                        className='px-3 py-2 rounded-md bg-white/10 outline outline-white/20 focus:outline-blue-500'
                        required
                    />
                </div>

                <div className='grid gap-1'>
                    <label className='font-medium'>Webhook</label>
                    <input
                        type='text'
                        value={webhook}
                        onChange={(e) => setWebhook(e.target.value)}
                        placeholder='discord.com/webhooks/abc/def'
                        className='px-3 py-2 rounded-md bg-white/10 outline outline-white/20 focus:outline-blue-500'
                        required
                    />
                </div>

                {error && <span className='text-sm text-red-500'>{error}</span>}

                <div className='flex justify-end gap-2 pt-2'>
                    <button
                        type='button'
                        onClick={() => setAddingNotification(false)}
                        className='px-4 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer'
                    >
                        Cancel
                    </button>
                    <button
                        type='submit'
                        className={`
                            px-4 py-0.5 rounded-lg bg-login/80 hover:bg-login
                            hover:brightness-110 cursor-pointer
                        `}
                    >
                        Create
                    </button>
                </div>
            </form>
        </div>
    )
}
