import { getLocation } from '@utils/api'
import Alert from '@components/alert/alert'

export default async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const location = await getLocation(Number(id))

    if (typeof location !== 'object' || Object.keys(location).length === 0) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <Alert>
                    Error loading location
                </Alert>
            </div>
        )
    }

    return (
        <div className='h-[var(--h-pageInfo)]'>
            <h1 className='font-semibold text-lg'>Update location: {location.name_en}</h1>
        </div>
    )
}
