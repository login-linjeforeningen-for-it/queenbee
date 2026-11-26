import AnnouncementFields from '@components/form/client/announcementFields'
import DiscordPreview from '@components/preview/discord'
import { useState } from 'react'
import { Switch } from 'uibee/components'

type AnnounceProps = {
    channels: Channel[]
    roles: Role[]
    event?: Record<string, unknown>
    eventId?: number
    formData?: {
        titleNo?: string
        titleEn?: string
        descriptionNo?: string
        descriptionEn?: string
        publishDate?: string
        publishTime?: string
        color?: string
    }
}

export default function Announce({ channels, roles, event, eventId, formData }: AnnounceProps) {
    const available = !!channels.length && !!roles.length
    const [enabled, setEnabled] = useState<boolean>(!eventId && available)

    return (
        <>
            <div className='col-span-2 flex items-center gap-4 pt-10 pb-4'>
                <h2 className='font-semibold'>Discord</h2>
                <Switch
                    name='announcement_enabled'
                    checked={enabled}
                    onChange={() => setEnabled((prev) => !prev)}
                    switchOnly
                    reserveError={false}
                    className='w-fit!'
                    disabled={!available}
                />
            </div>
            {!available && <p className='col-span-2 text-sm text-red-400'>Could not reach the bot API.</p>}
            {enabled && available && (
                <div className='col-span-2 grid lg:grid-cols-2 gap-x-8 gap-y-4'>
                    <AnnouncementFields
                        channels={channels}
                        roles={roles}
                        nested={true}
                        eventLinked={!!event}
                        formData={formData}
                    />
                    <DiscordPreview channels={channels} roles={roles} event={event} />
                    {event && <input type='hidden' name='announcement_event_linked' value='true' />}
                    {eventId && <input type='hidden' name='announcement_event_id' value={eventId} />}
                </div>
            )}
        </>
    )
}
