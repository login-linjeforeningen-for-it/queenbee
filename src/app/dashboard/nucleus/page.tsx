'use client'
import config from '@config'
import sendNotificationClient from '@utils/notification/sendNotificationClient'
import Link from 'next/link'
import { useState } from 'react'
import Input from '@components/inputs/input'
import { Send } from 'lucide-react'



export default function page() {
    const [result, setResult] = useState<SendResponseClient | null>()

    async function handleSend(formData: FormData) {
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const topic = formData.get('topic') as string
        const screen = formData.get('screen') as string
        const response = await sendNotificationClient({ title, description, screen, topic })
        if (response) {
            setResult(response)
            if (response.status === 200) {
                setTimeout(() => {
                    setResult(null)
                }, 2000)
            }
        }
    }

    return (
        <div className='flex flex-col h-full w-full'>
            <div className='mb-8'>
                <h1 className='text-2xl font-bold tracking-tight text-foreground'>Nucleus</h1>
                <p className='text-muted-foreground text-base mt-1'>Send a notification to the Login App</p>
            </div>
            {result?.status && (
                <div className={`rounded-md text-center mb-4 py-2 font-medium text-white ${result.status === 200 ? 'bg-green-500' : 'bg-red-500'}`}>
                    {result?.message}
                </div>
            )}
            <form
                onSubmit={e => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    handleSend(formData)
                }}
                className='flex flex-col gap-4 max-w-xl'
            >
                <Input name='title' type='text' label='Title' required className='' defaultValue='' />
                <Input name='description' type='text' label='Description' required className='' defaultValue='' />
                <Input name='topic' type='text' label='Topic' required className='' defaultValue='' />
                <Input name='screen' type='text' label='Screen' required className='' defaultValue='' />
                <div className='flex items-center justify-between pt-2'>
                    <button type='submit' className='flex flex-row w-fit gap-2 capitalize cursor-pointer bg-login/90 hover:bg-login/80 rounded-md px-4 py-1.5'>
                        <Send className='w-5' /> Send
                    </button>
                    <Link
                        target='_blank'
                        href={`${config.url.CDN_URL}/files/misc/push_notifications.pdf`}
                        className='bg-light text-foreground px-6 py-2 rounded-lg font-medium hover:bg-light/80 transition'
                    >
                        Documentation
                    </Link>
                </div>
            </form>
        </div>
    )
}