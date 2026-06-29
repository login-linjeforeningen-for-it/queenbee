import getNotifications from '@utils/api/beekeeper/services/getNotifications'
import deleteNotification from '@utils/api/beekeeper/services/deleteNotification'
import Table from '@components/table/table'
import { Button } from 'uibee/components'
import { Alert } from 'uibee/components'
import formatAlert from '@components/alert/formatAlert'

async function deleteAction(id: string) {
    'use server'
    await deleteNotification(Number(id))
}

const headers = ['id', 'name', 'message', 'webhook']

export default async function Page() {
    const result = await getNotifications()
    const error = typeof result === 'string' ? result : null
    const notifications = Array.isArray(result) ? result.map(n => ({
        ...n,
        system_table_id: n.id,
    })) : []

    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <h1 className='font-semibold text-lg text-login-50'>Notifications</h1>
                <div className='flex items-center justify-between py-3'>
                    <div />
                    <Button text='New notification' icon='+' path='/internal/monitoring/notifications/create' />
                </div>
            </div>

            {error || notifications.length === 0 ? (
                <div className='flex h-full items-center justify-center'>
                    <Alert>{formatAlert(error, 'No notifications found')}</Alert>
                </div>
            ) : (
                <div className='flex-1 flex flex-col overflow-hidden'>
                    <Table
                        list={notifications}
                        headers={headers}
                        deleteAction={deleteAction}
                        redirectPath='/internal/monitoring/notifications/update'
                    />
                </div>
            )}
        </div>
    )
}
