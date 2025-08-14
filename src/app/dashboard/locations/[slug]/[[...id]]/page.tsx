import { getLocation } from '@utils/api'
import { createLocation, updateLocation } from '@components/form/actions'
import FormWrapper from '@components/form/wrapper'
import { LocationFormInputs } from '@components/form/inputs'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ slug: string, id?: string[] }> }) {
    const { id, slug } = await params

    if (id) {
        const location = await getLocation(Number(id[0]))
        if (typeof location === 'object' && Object.keys(location).length > 0) {
            if(slug === 'create') {
                return (
                    <FormWrapper name='location' type='create' formAction={createLocation}>
                        <LocationFormInputs />
                    </FormWrapper>
                )
            } else if (slug === 'update') {
                return (
                    <FormWrapper name='location' type='update' formAction={updateLocation}>
                        <LocationFormInputs />
                    </FormWrapper>
                )
            }
        }
    } else if (slug === 'create') {
        return (
            <FormWrapper name='location' type='create' formAction={createLocation}>
                <LocationFormInputs />
            </FormWrapper>
        )
    }

    notFound()
}