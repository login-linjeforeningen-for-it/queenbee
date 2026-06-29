import BackButton from '@components/navigation/back'
import NotificationForm from '@components/status/notificationForm'
import getNotifications from '@utils/api/beekeeper/services/getNotifications'
import { createNotification, updateNotification } from '@components/form/actions/notifications'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ slug: string; id?: string[] }> }) {
    const { slug, id } = await params

    if (slug === 'create') {
        return (
            <NotificationPage title='Create notification'>
                <NotificationForm action={createNotification} />
            </NotificationPage>
        )
    }

    if (slug === 'update' && id?.[0]) {
        const all = await getNotifications()
        const notification = Array.isArray(all) ? all.find(n => String(n.id) === id[0]) : null
        if (!notification) notFound()

        return (
            <NotificationPage title='Update notification'>
                <NotificationForm action={updateNotification} defaultValues={notification} />
            </NotificationPage>
        )
    }

    notFound()
}

function NotificationPage({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className='w-full flex flex-col items-center'>
            <div className='w-full md:px-16 md:py-4'>
                <div className='flex flex-col gap-4'>
                    <BackButton pushURL='/internal/monitoring/notifications' />
                    <h1 className='font-semibold text-lg md:text-2xl'>{title}</h1>
                </div>
                {children}
            </div>
        </div>
    )
}
