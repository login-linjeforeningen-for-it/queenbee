import FormWrapper from '@components/form/wrapper'
import EventForm from '@components/form/server/events'
import getEvent from '@utils/api/workerbee/events/getEvent'
import { createEvent, updateEvent } from '@components/form/actions/events'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ slug: string; id?: string[] }> }) {
    const { id, slug } = await params

    if (id) {
        const event = await getEvent(Number(id[0]))
        if (typeof event === 'object' && Object.keys(event).length > 0) {
            if (slug === 'create') {
                return (
                    <FormWrapper
                        name='event'
                        path='events'
                        type='create'
                        formAction={createEvent}
                    >
                        <EventForm defaultValues={event} type='create' />
                    </FormWrapper>
                )
            } else if (slug === 'update') {
                return (
                    <FormWrapper
                        name='event'
                        path='events'
                        type='update'
                        id={id[0]}
                        formAction={updateEvent}
                    >
                        <EventForm defaultValues={event} type='update' />
                    </FormWrapper>
                )
            }
        }
    } else if (slug === 'create') {
        return (
            <FormWrapper
                name='event'
                path='events'
                type='create'
                formAction={createEvent}
            >
                <EventForm type='create' />
            </FormWrapper>
        )
    }

    notFound()
}
