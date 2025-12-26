import FormWrapper from '@components/form/wrapper'
import OrganizationFormInputs from '@components/form/server/organizations'
import getOrganization from '@utils/api/organizations/getOrganization'
import { notFound } from 'next/navigation'
import {
    createOrganization,
    updateOrganization,
} from '@components/form/actions/organizations'

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string; id?: string[] }>
}) {
    const { id, slug } = await params

    if (id) {
        const organization = await getOrganization(Number(id[0]))
        if (
            typeof organization === 'object' &&
            Object.keys(organization).length > 0
        ) {
            if (slug === 'create') {
                return (
                    <FormWrapper
                        name='organization'
                        path='organizations'
                        type='create'
                        formAction={createOrganization}
                    >
                        <OrganizationFormInputs defaultValues={organization} />
                    </FormWrapper>
                )
            } else if (slug === 'update') {
                return (
                    <FormWrapper
                        name='organization'
                        path='organizations'
                        type='update'
                        id={id[0]}
                        formAction={updateOrganization}
                    >
                        <OrganizationFormInputs defaultValues={organization} />
                    </FormWrapper>
                )
            }
        }
    } else if (slug === 'create') {
        return (
            <FormWrapper
                name='organization'
                path='organizations'
                type='create'
                formAction={createOrganization}
            >
                <OrganizationFormInputs />
            </FormWrapper>
        )
    }

    notFound()
}
