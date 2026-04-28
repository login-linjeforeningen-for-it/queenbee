import FormWrapper from '@components/form/wrapper'
import JobForm from '@components/form/server/jobs'
import getJob from '@utils/api/workerbee/jobs/getJob'
import { createJob, updateJob } from '@components/form/actions/jobs'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ slug: string; id?: string[] }> }) {
    const { id, slug } = await params

    if (id) {
        const job = await getJob(Number(id[0]))
        if (typeof job === 'object' && Object.keys(job).length > 0) {
            if (slug === 'create') {
                return (
                    <FormWrapper
                        name='job'
                        path='jobs'
                        type='create'
                        formAction={createJob}
                    >
                        <JobForm defaultValues={job} />
                    </FormWrapper>
                )
            } else if (slug === 'update') {
                return (
                    <FormWrapper
                        name='job'
                        path='jobs'
                        type='update'
                        id={id[0]}
                        formAction={updateJob}
                    >
                        <JobForm defaultValues={job} />
                    </FormWrapper>
                )
            }
        }
    } else if (slug === 'create') {
        return (
            <FormWrapper
                name='job'
                path='jobs'
                type='create'
                formAction={createJob}
            >
                <JobForm />
            </FormWrapper>
        )
    }

    notFound()
}
