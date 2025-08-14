import { getEvent } from '@utils/api'
import { createEvent, updateEvent } from '@components/form/actions'
import FormWrapper from '@components/form/wrapper'
import { EventFormInputs } from '@components/form/inputs'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ slug: string, id?: string[] }> }) {
    const { id, slug } = await params

    if (id) {
        const event = await getEvent(Number(id[0]))
        if (typeof event === 'object' && Object.keys(event).length > 0) {
            if(slug === 'create') {
                return (
                    <FormWrapper name='event' type='create' formAction={createEvent}>
                        <EventFormInputs />
                    </FormWrapper>
                )
            } else if (slug === 'update') {
                return (
                    <FormWrapper name='event' type='update' formAction={updateEvent}>
                        <EventFormInputs />
                    </FormWrapper>
                )
            }
        }
    } else if (slug === 'create') {
        return (
            <FormWrapper name='event' type='create' formAction={createEvent}>
                <EventFormInputs />
            </FormWrapper>
        )
    }

    notFound()
}