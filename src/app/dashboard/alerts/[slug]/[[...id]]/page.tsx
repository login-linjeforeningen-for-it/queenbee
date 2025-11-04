import { getAlert } from '@utils/api'
import { createAlert, updateAlert } from '@components/form/actions/alerts'
import FormWrapper from '@components/form/wrapper'
import { notFound } from 'next/navigation'
import AlertFormInputs from '@components/form/server/alerts'

export default async function Page({ params }: { params: Promise<{ slug: string; id?: string[] }> }) {
    const { id, slug } = await params

    if (id) {
        const alert = await getAlert(Number(id[0]))
        if (typeof alert === 'object' && Object.keys(alert).length > 0) {
            if (slug === 'create') {
                return (
                    <FormWrapper
                        name='alert'
                        path='alerts'
                        type='create'
                        formAction={createAlert}
                    >
                        <AlertFormInputs defaultValues={alert} />
                    </FormWrapper>
                )
            } else if (slug === 'update') {
                return (
                    <FormWrapper
                        name='alert'
                        path='alerts'
                        type='update'
                        id={id[0]}
                        formAction={updateAlert}
                    >
                        <AlertFormInputs defaultValues={alert} />
                    </FormWrapper>
                )
            }
        }
    } else if (slug === 'create') {
        return (
            <FormWrapper
                name='alert'
                path='alerts'
                type='create'
                formAction={createAlert}
            >
                <AlertFormInputs />
            </FormWrapper>
        )
    }

    notFound()
}
