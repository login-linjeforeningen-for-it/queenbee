import AnnouncementFormInputsClient from '@components/form/client/announcements'
import DiscordPreview from '@components/preview/discord'
import { MessageSquareWarning } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Switch } from 'uibee/components'

type AnnounceProps = {
    channels: Channel[]
    roles: Role[]
    title?: string
    description?: string
    publishDate?: string
    publishTime?: string
}

export default function Announce({ channels, roles, title, description, publishDate, publishTime }: AnnounceProps) {
    const [enabled, setEnabled] = useState<boolean>(false)
    const pathname = usePathname()

    if (pathname.includes('update/')) {
        setEnabled(false)

        return (
            <div className='col-span-2 space-apart bg-login-50/5 rounded-lg p-2 px-4 cursor-not-allowed mt-10'>
                <div className='flex justify-between'>
                    <div className='flex gap-2'>
                        <h1 className='text-2xl font-bold select-none text-login-200'>
                            Announce
                        </h1>
                        <h1 className='text-login-300 self-center mt-[1.2]'>
                            Announcements can currently not be edited from this page.
                        </h1>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            onClick={() => setEnabled(!enabled)}
            className='col-span-2 space-apart bg-login-50/5 rounded-lg p-2 px-4 mt-10 select-none'
        >
            <div className='flex justify-between'>
                <h1 className={
                    'text-2xl font-bold select-none '
                    + `${enabled ? 'text-foreground' : 'text-login-200'}`
                }>
                    Announce
                </h1>
                <Switch
                    name='announcement_enabled'
                    label='Disable | Enable '
                    checked={enabled}
                    onChange={() => setEnabled((prev) => !prev)}
                    switchOnly
                    className='self-center'
                />
            </div>
            {enabled && (
                <>
                    {!channels.length ? (
                        <div className='w-full space-y-4 mt-2 select-none' onClick={(e) => e.stopPropagation()}>
                            <div className='w-full h-0.5 bg-login-400 rounded-lg' />
                            <div className='flex gap-2 w-full rounded-lg p-2 bg-red-900'>
                                <MessageSquareWarning />
                                <h1 className='font-semibold'>Fail to connect to API</h1>
                            </div>
                        </div>
                    ) : (
                        <div className='w-full space-y-4 mt-2 select-none' onClick={(e) => e.stopPropagation()}>
                            <div className='w-full h-0.5 bg-login-400 rounded-lg' />
                            <div className='grid grid-cols-2 gap-4'>
                                <AnnouncementFormInputsClient
                                    channels={channels}
                                    roles={roles}
                                    nested={true}
                                    title={title}
                                    description={description}
                                    publishDate={publishDate}
                                    publishTime={publishTime}
                                />
                                <DiscordPreview channels={channels} roles={roles} />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
