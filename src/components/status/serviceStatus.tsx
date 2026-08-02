import smallDate from '@utils/date/smallDate'
import CertificateStatus from './certificateStatus'
import CertificateDetails from './certificateDetails'
import { Button, Card } from 'uibee/components'
import { Edit } from 'lucide-react'
import ManagedTable from '@components/table/managedTable'

type ServiceStatusProps = {
    service?: Service
    onEdit?: (service: Service) => void
}

export default function ServiceStatus({ service, onEdit }: ServiceStatusProps) {
    if (!service) {
        return <></>
    }

    return (
        <Card className='flex flex-col gap-4 p-4'>
            <div className='flex w-full justify-between items-center'>
                <h2 className='text-xl font-semibold'>{service.name}</h2>
                <div className='flex items-center gap-3'>
                    <CertificateStatus service={service} />
                    {onEdit ? (
                        <Button
                            text='Edit'
                            icon={<Edit className='h-4 w-4' />}
                            variant='secondary'
                            onClick={() => onEdit(service)}
                        />
                    ) : null}
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <div className='rounded-lg w-full bg-login-50/5 p-2'>
                    <div className='flex justify-between items-center'>
                        <h1 className='font-semibold'>Notification policy</h1>
                        {onEdit ? (
                            <button type='button' className='text-sm text-login-200 hover:text-login-50' onClick={() => onEdit(service)}>
                                Edit
                            </button>
                        ) : null}
                    </div>
                    {service.notificationPolicy ? (
                        <div className='grid gap-3 mt-3'>
                            <div>
                                <h2 className='text-login-50 text-sm'>Name</h2>
                                <p className='text-login-200 text-sm'>{service.notificationPolicy.name}</p>
                            </div>
                            <div>
                                <h2 className='text-login-50 text-sm'>Message</h2>
                                <p className='text-login-200 text-sm wrap-break-word'>
                                    {service.notificationPolicy.message || 'No custom message'}
                                </p>
                            </div>
                            <div>
                                <h2 className='text-login-50 text-sm'>Webhook</h2>
                                <p className='text-login-200 text-sm wrap-break-word'>{service.notificationPolicy.webhook}</p>
                            </div>
                        </div>
                    ) : (
                        <p className='text-login-200 text-sm mt-3'>No notification policy configured.</p>
                    )}
                </div>
                <CertificateDetails service={service} />
            </div>

            <ManagedTable
                data={service.bars.map((bar, index) => {
                    let status: 'up' | 'down' | 'maintenance' | 'pending'
                    if (service.enabled && bar.status) {
                        status = 'up'
                    } else if (service.enabled && !bar.status && bar.expectedDown) {
                        status = 'maintenance'
                    } else if (service.enabled && !bar.status && service.maxConsecutiveFailures > 0) {
                        let pendingFailed = 0
                        for (let i = 0; i < Math.min(service.maxConsecutiveFailures, service.bars.length); i++) {
                            if (!service.bars[i].status) pendingFailed++
                        }
                        status = pendingFailed < service.maxConsecutiveFailures ? 'pending' : 'down'
                    } else {
                        status = 'down'
                    }
                    return { _id: String(index), name: service.name, status, time: smallDate(bar.timestamp), message: bar.note }
                }) as unknown as Record<string, unknown>[]}
                columns={[
                    { key: 'name' },
                    { key: 'status', highlight: { up: 'green', down: 'red', maintenance: 'purple', pending: 'yellow' } },
                    { key: 'time' },
                    { key: 'message' },
                ]}
                idKey='_id'
                hidePagination
            />
        </Card>
    )
}
