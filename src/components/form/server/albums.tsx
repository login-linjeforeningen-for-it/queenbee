import getAllEvents from '@utils/api/workerbee/events/getAllEvents'
import AlbumFields from '../client/albumFields'

export default async function AlbumForm({ defaultValues, type }: { defaultValues?: GetAlbumProps, type: 'create' | 'update'})
{
    const eventsResponse = await getAllEvents()
    const events = typeof eventsResponse !== 'string' ? eventsResponse : []
    const eventsOptions = Array.isArray(events)
        ? events.map((event) => ({
            label: `${event.name_en} | ${event.time_start.split('T')[0]}`,
            value: event.id,
        }))
        : []

    return <AlbumFields
        defaultValues={defaultValues}
        type={type}
        eventsOptions={eventsOptions}
    />
}
