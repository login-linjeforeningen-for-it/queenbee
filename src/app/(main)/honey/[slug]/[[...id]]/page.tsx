import FormWrapper from '@components/form/wrapper'
import HoneyFormInputs from '@components/form/server/honeys'
import getHoney from '@utils/api/workerbee/honey/get'
import { createHoney, updateHoney } from '@components/form/actions/honeys'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ slug: string; id?: string[] }> }) {
    const { id, slug } = await params

    if (id) {
        const honey = await getHoney(Number(id[0]))
        if (typeof honey === 'object' && Object.keys(honey).length > 0) {
            if (slug === 'create') {
                return (
                    <FormWrapper
                        name='honey'
                        path='honeys'
                        type='create'
                        formAction={createHoney}
                    >
                        <HoneyFormInputs defaultValues={honey} />
                    </FormWrapper>
                )
            } else if (slug === 'update') {
                return (
                    <FormWrapper
                        name='honey'
                        path='honeys'
                        type='update'
                        id={id[0]}
                        formAction={updateHoney}
                    >
                        <HoneyFormInputs defaultValues={honey} />
                    </FormWrapper>
                )
            }
        }
    } else if (slug === 'create') {
        return (
            <FormWrapper
                name='honey'
                path='honeys'
                type='create'
                formAction={createHoney}
            >
                <HoneyFormInputs />
            </FormWrapper>
        )
    }

    notFound()
}
