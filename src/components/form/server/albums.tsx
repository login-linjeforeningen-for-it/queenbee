import getAllEvents from '@utils/api/events/getAllEvents'
import AlbumFormInputsClient from '../client/albums'

export default async function AlbumFormInputs(
    { defaultValues, type, parent }:
    { defaultValues?: GetAlbumProps, type: 'create' | 'update', parent?: { preview?: boolean }})
{
    const eventsResponse = await getAllEvents()
    const events = typeof eventsResponse !== 'string' ? eventsResponse : []
    const eventsOptions = Array.isArray(events)
        ? events.map((event) => ({
            label: `${event.name_en} | ${event.time_start.split('T')[0]}`,
            value: event.id,
        }))
        : []

    return <AlbumFormInputsClient
        defaultValues={defaultValues}
        preview={parent?.preview}
        type={type}
        eventsOptions={eventsOptions}
    />
}
