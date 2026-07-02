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
            <CertificateDetails service={service} />

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
