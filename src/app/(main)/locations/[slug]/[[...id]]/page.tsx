import FormWrapper from '@components/form/wrapper'
import LocationFormInputs from '@components/form/server/locations'
import getLocation from '@utils/api/locations/getLocation'
import { createLocation, updateLocation } from '@components/form/actions/locations'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ slug: string; id?: string[] }> }) {
    const { id, slug } = await params

    if (id) {
        const location = await getLocation(Number(id[0]))
        if (typeof location === 'object' && Object.keys(location).length > 0) {
            if (slug === 'create') {
                return (
                    <FormWrapper
                        name='location'
                        path='locations'
                        type='create'
                        formAction={createLocation}
                    >
                        <LocationFormInputs defaultValues={location} />
                    </FormWrapper>
                )
            } else if (slug === 'update') {
                return (
                    <FormWrapper
                        name='location'
                        path='locations'
                        type='update'
                        id={id[0]}
                        formAction={updateLocation}
                    >
                        <LocationFormInputs defaultValues={location} />
                    </FormWrapper>
                )
            }
        }
    } else if (slug === 'create') {
        return (
            <FormWrapper
                name='location'
                path='locations'
                type='create'
                formAction={createLocation}
            >
                <LocationFormInputs />
            </FormWrapper>
        )
    }

    notFound()
}
