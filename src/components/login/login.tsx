'use client'

import config from '@config'
import { setCookie } from '@utils/cookies'
import { LogIn } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const loginUrl = `${process.env.NEXT_PUBLIC_BROWSER_API}/oauth2/login`

export default function Login() {
    const [loginUnavailable, setLoginUnavailable] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(loginUrl)
                if (!response.ok) {
                    setLoginUnavailable(true)
                }
            } catch (error) {
                console.log(error)
                setLoginUnavailable(true)
            }
        })()
    }, [loginUrl])

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

            setCookie('name', name, 1)
            setCookie('access_token', token, 1)
            setCookie('btg', token, 1)
        } catch (error) {
            setErrorMessage(error instanceof Error
                ? error.message.includes('Unauthorized')
                    ? 'Unauthorized'
                    : error.message
                : 'Unknown error! Please contact TekKom')
        }
    }

    if (loginUnavailable) {
        return (
            <div>
                <form className='flex flex-col gap-4 p-4 rounded-xl w-80 mx-auto' onSubmit={handleSubmit}>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        className='border-none rounded-xl px-3 py-2 bg-login-900'
                        autoComplete='current-password'
                        placeholder='Name'
                    />
                    <input
                        type='password'
                        id='token'
                        name='token'
                        className='border-none rounded-xl px-3 py-2 bg-login-900'
                        autoComplete='current-password'
                        placeholder='Token'
                    />
                    <button
                        type='submit'
                        className='bg-login text-dark px-5 py-1 rounded-xl cursor-pointer mt-2'
                    >
                        Login
                    </button>
                </form>
                <p className='text-red-500 text-center py-2 bg-normal rounded-xl'>{errorMessage}</p>
            </div>
        )
    }

    return (
        <Link
            href={loginUrl}
            className='grid place-items-center'
        >
            <button
                className={
                    'flex align-middle gap-2 mt-2 rounded-lg ' +
                    'bg-login px-8 py-1  hover:bg-orange-500 mb-2'
                }
            >
                Login
                <LogIn className='w-5' />
            </button>
        </Link>
    )
}
