'use client'

import { useRouter } from 'next/navigation'
import { getCookie, removeCookie, setCookie } from '@utils/cookies'
import { useEffect, useState } from 'react'
import { LoginPage } from 'uibee/components'
import config from '@config'
import { toast } from 'sonner'

export default function Home() {
    const router = useRouter()
    const [loginUnavailable, setLoginUnavailable] = useState(false)

    useEffect(() => {
        const token = getCookie('access_token')
        if (token) {
            router.push('/dashboard')
        }
    }, [])

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch('/api/authentik-health')
                if (!response.ok) {
                    setLoginUnavailable(true)
                }

                removeCookie('btg_name')
            } catch (error) {
                console.log(error)
                setLoginUnavailable(true)
            }
        })()
    }, [])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const name = formData.get('name') as string
        const token = formData.get('token') as string

        try {
            const response = await fetch(`${config.url.TEKKOM_BOT_API_URL}/token`, {
                headers: {
                    name,
                    'btg': 'queenbee-btg',
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error(await response.text())
            }

            setCookie('btg_name', name, 1)
            setCookie('access_token', token, 1)
            setCookie('bot_access_token', token, 1)
            document.location.href = `login?access_token=${token}&btg=true`
        } catch (error) {
            toast.error(error instanceof Error
                ? error.message.includes('Unauthorized')
                    ? 'Unauthorized'
                    : error.message
                : 'Unknown error! Please contact TekKom')
        }
    }

    return (
        <LoginPage
            title='QueenBee'
            description='Content Management System'
            redirectURI={`${process.env.NEXT_PUBLIC_URI}/api/login`}
            btg={loginUnavailable}
            onSubmit={handleSubmit}
            version={config.version}
        />
    )
}
