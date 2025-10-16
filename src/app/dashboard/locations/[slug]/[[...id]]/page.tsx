import { getLocation } from '@utils/api'
import { createLocation, updateLocation } from '@components/form/actions/locations'
import FormWrapper from '@components/form/wrapper'
import LocationFormInputs from '@components/form/server/locations'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ slug: string; id?: string[] }> }) {
    const { id, slug } = await params

    console.log('Location page params', { id, slug })

    if (id) {
        const location = await getLocation(Number(id[0]))
        console.log('Location data', location)
        if (typeof location === 'object' && Object.keys(location).length > 0) {
            if (slug === 'create') {
                return (
                    <FormWrapper
                        name='location'
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
                type='create'
                formAction={createLocation}
            >
                <LocationFormInputs />
            </FormWrapper>
        )
    }

    notFound()
}
