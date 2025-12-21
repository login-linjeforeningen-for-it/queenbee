'use client'

import { useEffect, useState } from 'react'
import FancyField from '../root/fancyField'
import postMessage from '@/utils/fetch/message/post'
import { getCookie, removeCookie, setCookie } from '@/utils/cookies'
import { usePathname, useRouter } from 'next/navigation'

type PostMessageProps = {
    title: string
    content: string
    status: string
}

export default function PostMessage({ title: Title, content: Content, status: Status }: PostMessageProps) {
    const [title, setTitle] = useState(Title)
    const [content, setContent] = useState(Content)
    const [status, setStatus] = useState(Status)
    const [response, setResponse] = useState<Result | null>(null)
    const router = useRouter()
    const path = usePathname()
    const responseColor = response?.status === 200 ? 'bg-green-500/20' : 'bg-red-500/20'

    async function handleSubmit() {
        const token = getCookie('access_token')
        const author = getCookie('email')
        if (!token || !author) {
            setCookie('redirect', path)
            return router.push('/logout')
        }

        const response = await postMessage({
            message: { title, content, author, status },
            token
        })
        if (response.status === 200) {
            setTitle('')
            setContent('')
            setStatus('')

            setTimeout(() => {
                setResponse(null)
            }, 3000)
        }
        setResponse(response)
    }

    useEffect(() => {
        window.addEventListener('beforeunload', () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            title.length ? setCookie('messageTitle', title) : removeCookie('messageTitle')
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            content.length ? setCookie('messageContent', content) : removeCookie('messageContent')
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            status.length ? setCookie('messageStatus', status) : removeCookie('messageStatus')
        })
        return () => {
            window.removeEventListener('beforeunload', () => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                title.length ? setCookie('messageTitle', title) : removeCookie('messageTitle')
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                content.length ? setCookie('messageContent', content) : removeCookie('messageContent')
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                status.length ? setCookie('messageStatus', status) : removeCookie('messageStatus')
            })
        }
    }, [title, content, status])

    return (
        <div className='w-full h-full bg-login-600 rounded-lg p-2'>
            <h1>Post Message</h1>
            {response !== null && <h1 className={`${responseColor} py-1 text-center w-full text-bright rounded-lg mt-1 mb-2`}>
                {response.message}
            </h1>}
            <div className='grid gap-2 text-login-200'>
                <FancyField placeholder='Title' value={title} setValue={setTitle} />
                <FancyField placeholder='Content' value={content} setValue={setContent} />
                <FancyField placeholder='Status' value={status} setValue={setStatus} />
                <button
                    onClick={handleSubmit}
                    className='cursor-pointer bg-login py-1 text-center w-full text-bright rounded-lg select-none'
                >
                    Post
                </button>
            </div>
        </div>
    )
}
