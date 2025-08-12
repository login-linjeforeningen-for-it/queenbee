import { getJob } from '@utils/api'
import Alert from '@components/alert/alert'

export default async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const job = await getJob(Number(id))

    if (typeof job !== 'object' || Object.keys(job).length === 0) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <Alert>
                    Error loading job
                </Alert>
            </div>
        )
    }

    return (
        <div className='h-[var(--h-pageInfo)]'>
            <h1 className='font-semibold text-lg'>Update job: {job.title_no}</h1>
        </div>
    )
}
