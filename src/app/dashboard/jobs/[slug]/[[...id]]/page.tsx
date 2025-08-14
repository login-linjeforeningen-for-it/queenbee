import { getJob } from '@utils/api'
import { createJob, updateJob } from '@components/form/actions'
import FormWrapper from '@components/form/wrapper'
import { JobFormInputs } from '@components/form/inputs'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ slug: string, id?: string[] }> }) {
    const { id, slug } = await params

    if (id) {
        const job = await getJob(Number(id[0]))
        if (typeof job === 'object' && Object.keys(job).length > 0) {
            if(slug === 'create') {
                return (
                    <FormWrapper name='job' type='create' formAction={createJob}>
                        <JobFormInputs />
                    </FormWrapper>
                )
            } else if (slug === 'update') {
                return (
                    <FormWrapper name='job' type='update' formAction={updateJob}>
                        <JobFormInputs />
                    </FormWrapper>
                )
            }
        }
    } else if (slug === 'create') {
        return (
            <FormWrapper name='job' type='create' formAction={createJob}>
                <JobFormInputs />
            </FormWrapper>
        )
    }

    notFound()
}