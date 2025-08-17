import { getOrganization } from '@utils/api'
import { createOrganization, updateOrganization } from '@components/form/actions'
import FormWrapper from '@components/form/wrapper'
import { OrganizationFormInputs } from '@components/form/inputs'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ slug: string, id?: string[] }> }) {
    const { id, slug } = await params

    if (id) {
        const organization = await getOrganization(id[0])
        if (typeof organization === 'object' && Object.keys(organization).length > 0) {
            if(slug === 'create') {
                return (
                    <FormWrapper name='organization' type='create' formAction={createOrganization}>
                        <OrganizationFormInputs defaultValues={organization} />
                    </FormWrapper>
                )
            } else if (slug === 'update') {
                return (
                    <FormWrapper name='organization' type='update' id={id[0]} formAction={updateOrganization}>
                        <OrganizationFormInputs defaultValues={organization} />
                    </FormWrapper>
                )
            }
        }
    } else if (slug === 'create') {
        return (
            <FormWrapper name='organization' type='create' formAction={createOrganization}>
                <OrganizationFormInputs />
            </FormWrapper>
        )
    }

    notFound()
}