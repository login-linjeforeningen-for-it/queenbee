import AnnouncementFormInputsClient from '@components/form/client/announcements'
import DiscordPreview from '@components/preview/discord'
import ArrowDown from '@components/shared/arrowDown'
import ArrowRight from '@components/shared/arrowRight'
import { getCookie, setCookie } from '@utils/cookies'
import { useState } from 'react'

export default function Announce({ channels }: { channels: Channel[] }) {
    const [state, setState] = useState(getCookie('announceBar'))
    const isOpen = state === 'open'

    function handleClick() {
        setState((prev) => prev === 'closed' ? 'open' : 'closed')
        setCookie('announceBar', state === 'closed' ? 'open' : 'closed')
    }

    return (
        <div onClick={handleClick} className='col-span-2 space-apart bg-login-600 rounded-lg p-2 px-4 cursor-pointer mt-10'>
            <div className='flex justify-between'>
                <h1 className={
                    'text-2xl font-bold select-none '
                    + `${isOpen ? 'text-foreground' : 'text-(var:--color-login-200)'}`
                }>
                    Announce
                </h1>
                <div className='h-[20px] w-[20px] self-center'>
                    {isOpen ? <ArrowDown color='#fd8738' /> : <ArrowRight color='#fd8738' />}
                </div>
            </div>
            <OpenAnnouncement isOpen={isOpen} channels={channels} />
        </div>
    )
}

function OpenAnnouncement({ isOpen, channels: channelsInput }: { isOpen: boolean, channels: Channel[] }) {
    if (!isOpen) {
        return <></>
    }

    const channels = Array.isArray(channelsInput)
        ? channelsInput.map((channel) => ({ ...channel }))
        : []

    return (
        <div className='w-full space-y-4 mt-2' onClick={(e) => e.stopPropagation()}>
            <div className='w-full h-[2px] bg-(var:--color-login-400) rounded-lg' />
            <div className='grid grid-cols-2 gap-4'>
                <AnnouncementFormInputsClient
                    channels={channels}
                    nested={true}
                    color='bg-login-600'
                    buttonColor='bg-login-500'
                    buttonColorHighlighted='bg-login-400'
                />
                <DiscordPreview />
            </div>
        </div>
    )
}
