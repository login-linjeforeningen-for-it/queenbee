import AnnouncementFormInputsClient from '@components/form/client/announcements'
import DiscordPreview from '@components/preview/discord'
import ArrowDown from '@components/shared/arrowDown'
import ArrowRight from '@components/shared/arrowRight'
import { getCookie, setCookie } from '@utils/cookies'
import { LogIn, MessageSquareWarning } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Announce({ channels, roles }: { channels: Channel[], roles: Role[] }) {
    const [state, setState] = useState('closed')
    const pathname = usePathname()
    const isOpen = state === 'open'

    useEffect(() => {
        const cookie = getCookie('announceBar')
        if (cookie) {
            setState(cookie)
        }
    }, [])

    function handleClick() {
        setState((prev) => prev === 'closed' ? 'open' : 'closed')
        setCookie('announceBar', state === 'closed' ? 'open' : 'closed')
    }

    if (pathname.includes('update/')) {
        if (state === 'open') {
            setState('closed')
        }

        return (
            <div className='col-span-2 space-apart bg-login-600 rounded-lg p-2 px-4 cursor-pointer mt-10'>
                <div className='flex justify-between'>
                    <div className='flex gap-2'>
                        <h1 className={'text-2xl font-bold select-none text-login-200'}>
                            Announce
                        </h1>
                        <h1 className='text-login-300 self-center mt-[1.2]'>
                            Announcements can currently not be edited from this page.
                        </h1>
                    </div>
                    <div className='h-5 w-5 self-center'>
                        <ArrowRight color='#fd8738' />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            onClick={handleClick}
            className='col-span-2 space-apart bg-login-600 rounded-lg p-2 px-4 cursor-pointer mt-10'
        >
            <div className='flex justify-between'>
                <h1 className={
                    'text-2xl font-bold select-none '
                    + `${isOpen ? 'text-foreground' : 'text-login-200'}`
                }>
                    Announce
                </h1>
                <div className='h-5 w-5 self-center'>
                    {isOpen ? <ArrowDown color='#fd8738' /> : <ArrowRight color='#fd8738' />}
                </div>
            </div>
            <OpenAnnouncement isOpen={isOpen} channels={channels} roles={roles} />
        </div>
    )
}

function OpenAnnouncement({
    isOpen,
    channels,
    roles
}: {
    isOpen: boolean,
    channels: Channel[],
    roles: Role[]
}) {
    if (!isOpen) {
        return <></>
    }

    function handleLogin() {
        if (typeof window !== 'undefined') {
            window.location.href = `${process.env.NEXT_PUBLIC_BROWSER_API}/oauth2/login`
        }
    }

    if (!channels.length) {
        return (
            <div className='w-full space-y-4 mt-2' onClick={(e) => e.stopPropagation()}>
                <div className='w-full h-0.5 bg-login-400 rounded-lg' />
                <div className='flex gap-2 w-full rounded-lg p-2 bg-red-900'>
                    <MessageSquareWarning />
                    <h1 className='font-semibold'>Unauthorized</h1>
                </div>
                <div className='grid place-items-center h-full'>
                    <button
                        onClick={handleLogin}
                        className={
                            'flex align-middle gap-2 mt-2 rounded-lg cursor-pointer ' +
                            'bg-login px-8 py-1  hover:bg-orange-500 mb-2'
                        }
                    >
                        Login
                        <LogIn className='w-5' />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='w-full space-y-4 mt-2' onClick={(e) => e.stopPropagation()}>
            <div className='w-full h-0.5 bg-login-400 rounded-lg' />
            <div className='grid grid-cols-2 gap-4'>
                <AnnouncementFormInputsClient
                    channels={channels}
                    roles={roles}
                    nested={true}
                    color='bg-login-600'
                    buttonColor='bg-login-500'
                    buttonColorHighlighted='bg-login-400'
                    required={false}
                />
                <DiscordPreview channels={channels} roles={roles} />
            </div>
        </div>
    )
}
