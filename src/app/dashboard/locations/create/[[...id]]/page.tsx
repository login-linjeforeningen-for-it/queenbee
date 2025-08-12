import { getLocation } from '@utils/api'

export default async function Page({ params }: { params: Promise<{ id?: string[] }> }) {
    const { id } = await params
    if (id) {
        const location = await getLocation(Number(id[0]))
        if (typeof location === 'object' && Object.keys(location).length > 0) {
            return (
                <div className='h-[var(--h-pageInfo)]'>
                    <h1 className='font-semibold text-lg'>Copy from: {location.name_en}</h1>
                </div>
            )
        }
    }

    return (
        <div className='h-[var(--h-pageInfo)]'>
            <h1 className='font-semibold text-lg'>New location</h1>
        </div>
    )
}
