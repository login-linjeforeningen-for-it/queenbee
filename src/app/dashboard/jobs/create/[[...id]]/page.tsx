import { getJob } from '@utils/api'

export default async function Page({ params }: { params: Promise<{ id?: string[] }> }) {
    const { id } = await params
    if (id) {
        const job = await getJob(Number(id[0]))
        if (typeof job === 'object' && Object.keys(job).length > 0) {
            return (
                <div className='h-[var(--h-pageInfo)]'>
                    <h1 className='font-semibold text-lg'>Copy from: {job.title_en}</h1>
                </div>
            )
        }
    }

    return (
        <div className='h-[var(--h-pageInfo)]'>
            <h1 className='font-semibold text-lg'>New job</h1>
        </div>
    )
}
