import { getEvent } from '@utils/api'
import Alert from '@components/alert/alert'

export default async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const event = await getEvent(Number(id))

    if (typeof event !== 'object' || Object.keys(event).length === 0) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <Alert>
                    Error loading event
                </Alert>
            </div>
        )
    }

    return (
        <div className='h-[var(--h-pageInfo)]'>
            <h1 className='font-semibold text-lg'>Update event: {event.name_en}</h1>
        </div>
    )
}
