'use client'
import sendNotificationClient from '@utils/notification/sendNotificationClient'
import Link from 'next/link'
import { useState } from 'react'
import Input from '@components/inputs/input'
import { Send } from 'lucide-react'
import Button from '@components/button/button'
import Preview from '@components/preview/preview'

export default function page() {
    const [result, setResult] = useState<SendResponseClient | null>()
    const [formValues, setFormValues] = useState({
        title: '' as string,
        description: '' as string,
        topic: '' as string | number,
        screen: '' as string | number,
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
                setTimeout(() => {
                    setResult(null)
                }, 2000)
            }
        }
    }

    return (
        <div className='flex h-full w-full gap-4'>
            <div className='w-120'>
                <div className='mb-8'>
                    <h1
                        className={
                            'text-2xl font-bold tracking-tight text-foreground'
                        }
                    >
                        Nucleus
                    </h1>
                    <p className='text-muted-foreground text-base mt-1'>
                        Send a notification to the Login App
                    </p>
                </div>
                {result?.status && (
                    <div
                        className={
                            'rounded-md text-center mb-4 py-2 font-medium ' +
                            `${
                                result.status === 200
                                    ? 'bg-green-500'
                                    : 'bg-red-500'
                            }`
                        }
                    >
                        {result?.message}
                    </div>
                )}
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        handleSend(formData)
                    }}
                    className='flex flex-col gap-4 max-w-xl'
                >
                    <Input
                        name='title'
                        type='text'
                        label='Title'
                        required
                        className=''
                        setValue={(input) =>
                            setFormValues({
                                ...formValues,
                                title: input.toString(),
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
                        setValue={(input) =>
                            setFormValues({
                                ...formValues,
                                description: input.toString(),
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
                        setValue={(input) =>
                            setFormValues({ ...formValues, topic: input })
                        }
                        value={formValues.topic || ''}
                    />
                    <Input
                        name='screen'
                        type='text'
                        label='Screen'
                        required
                        className=''
                        setValue={(input) =>
                            setFormValues({ ...formValues, screen: input })
                        }
                        value={formValues.screen || ''}
                    />
                    {formValues.title.length > 0 && (
                        <div
                            className={
                                'block lg:hidden relative ' +
                                'h-22 w-full z-200'
                            }
                        >
                            <Preview
                                small={true}
                                title={formValues.title}
                                description={formValues.description}
                            />
                        </div>
                    )}
                    <div className='flex items-center justify-between'>
                        <button
                            type='submit'
                            className={
                                'flex flex-row w-fit gap-2 capitalize ' +
                                'cursor-pointer bg-login/90 ' +
                                'hover:bg-login/80 rounded-md px-4 py-1'
                            }
                        >
                            <Send className='w-5' /> Send
                        </button>
                        <div className='flex justify-between gap-2'>
                            <Button
                                color='secondary'
                                text='Example'
                                icon='+'
                                onClick={() => setExample(setFormValues)}
                            />
                            <Link
                                href={'/dashboard/nucleus/documentation'}
                                className={
                                    'bg-login-600 text-foreground px-4 grid ' +
                                    'place-items-center rounded-lg ' +
                                    'font-medium hover:bg-login-600/80 ' +
                                    'transition'
                                }
                            >
                                Documentation
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
            <div className='hidden lg:block w-104'>
                <Preview
                    title={formValues.title}
                    description={formValues.description}
                />
            </div>
        </div>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setExample(setFormValues: (_: any) => void) {
    setFormValues({
        title: 'Welcome to Nucleus 🚀',
        description: 'This is a test push notification',
        topic: 'example',
        screen: 'home',
    })
}
