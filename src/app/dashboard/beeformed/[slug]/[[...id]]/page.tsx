// import { getForm } from '@utils/api'
import { createForm, updateForm } from '@components/form/actions/beeformed'
import FormWrapper from '@components/form/wrapper'
import BeeFormedFormInputs from '@components/form/server/beeformed'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ slug: string; id?: string[] }> }) {
    const { id, slug } = await params

    if (id) {
        const form = {} // await getForm(Number(id[0]))
        if (typeof form === 'object' && Object.keys(form).length > 0) {
            if (slug === 'create') {
                return (
                    <FormWrapper
                        name='form'
                        type='create'
                        formAction={createForm}
                    >
                        <BeeFormedFormInputs defaultValues={form} />
                    </FormWrapper>
                )
            } else if (slug === 'update') {
                return (
                    <FormWrapper
                        name='form'
                        type='update'
                        id={id[0]}
                        formAction={updateForm}
                    >
                        <BeeFormedFormInputs defaultValues={form} />
                    </FormWrapper>
                )
            }
        }
    } else if (slug === 'create') {
        return (
            <FormWrapper name='form' type='create' formAction={createForm}>
                <BeeFormedFormInputs />
            </FormWrapper>
        )
    }

    notFound()
}