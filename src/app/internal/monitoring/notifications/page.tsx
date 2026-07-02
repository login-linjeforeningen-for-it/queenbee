import getNotifications from '@utils/api/beekeeper/services/getNotifications'
import deleteNotification from '@utils/api/beekeeper/services/deleteNotification'
import ManagedTable from '@components/table/managedTable'
import { Button } from 'uibee/components'

async function deleteAction(id: string) {
    'use server'
    await deleteNotification(Number(id))
}

const columns = [
    { key: 'id' },
    { key: 'name' },
    { key: 'message' },
    { key: 'webhook' },
]

export default async function Page() {
    const result = await getNotifications()
    const notifications = Array.isArray(result) ? result : []

    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <h1 className='font-semibold text-lg text-login-50'>Notifications</h1>
                <div className='flex items-center justify-between py-3'>
                    <div />
                    <Button text='New notification' icon='+' path='/internal/monitoring/notifications/create' />
                </div>
            </div>

            <div className='flex-1 flex flex-col overflow-hidden'>
                <ManagedTable
                    data={notifications as unknown as Record<string, unknown>[]}
                    columns={columns}
                    idKey='id'
                    deleteAction={deleteAction}
                    redirectPath='/internal/monitoring/notifications/update'
                />
            </div>
        </div>
    )
}
