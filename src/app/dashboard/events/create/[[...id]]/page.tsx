import { getEvent } from '@utils/api'

export default async function Page({ params }: { params: Promise<{ id?: string[] }> }) {
    const { id } = await params
    if (id) {
        const event = await getEvent(Number(id[0]))
        if (typeof event === 'object' && Object.keys(event).length > 0) {
            return (
                <div className='h-[var(--h-pageInfo)]'>
                    <h1 className='font-semibold text-lg'>Copy from: {event.name_en}</h1>
                </div>
            )
        }
    }

    return (
        <div className='h-[var(--h-pageInfo)]'>
            <h1 className='font-semibold text-lg'>New event</h1>
        </div>
    )
}
