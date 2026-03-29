import smallDate from '@utils/date/smallDate'
import { barOutlineColor } from '@utils/status/barColor'
import CertificateStatus from './certificateStatus'
import CertificateDetails from './certificateDetails'

type ServiceStatusProps = {
    service?: Service
}

export default function ServiceStatus({ service }: ServiceStatusProps) {
    if (!service) {
        return <></>
    }

    return (
        <div className='flex flex-col gap-4 bg-login-50/5 p-4 rounded-xl border border-white/5'>
            <div className='flex w-full justify-between items-center'>
                <h2 className='text-xl font-semibold'>{service.name}</h2>
                <CertificateStatus service={service} />
            </div>
            <CertificateDetails service={service} />

            <div className='overflow-x-auto rounded-lg border border-white/5'>
                <table className='w-full text-sm text-left'>
                    <thead className='text-xs text-muted-foreground uppercase bg-black/20'>
                        <tr>
                            <th className='px-4 py-3 font-medium w-1/4'>Name</th>
                            <th className='px-4 py-3 font-medium w-1/6'>Status</th>
                            <th className='px-4 py-3 font-medium w-1/4'>Time</th>
                            <th className='px-4 py-3 font-medium'>Message</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-white/5'>
                        {service.bars.map((bar, index) => {
                            let status: 'up' | 'down' | 'maintenance' | 'pending' | null
                            if (service.enabled && bar.status) {
                                status = 'up'
                            } else if (service.enabled && !bar.status && bar.expectedDown) {
                                status = 'maintenance'
                            } else if (service.enabled && !bar.status && service.maxConsecutiveFailures > 0) {
                                let pendingFailed = 0
                                for (let i = 0; i < Math.min(service.maxConsecutiveFailures, service.bars.length); i++) {
                                    if (!service.bars[i].status) {
                                        pendingFailed++
                                    }
                                }

                                if (pendingFailed < service.maxConsecutiveFailures) {
                                    status = 'pending'
                                } else {
                                    status = 'down'
                                }
                            } else {
                                status = 'down'
                            }

                            return (
                                <tr key={index} className='hover:bg-white/5 transition-colors'>
                                    <td className='px-4 py-3 font-medium text-foreground truncate max-w-xs'>{service.name}</td>
                                    <td className='px-4 py-3'>
                                        <span className={`
                                            inline-flex items-center justify-center
                                            text-xs outline px-2 rounded-md py-0.5 font-medium
                                            ${barOutlineColor(bar, service.maxConsecutiveFailures, status)}
                                            `}>
                                            {status}
                                        </span>
                                    </td>
                                    <td className='px-4 py-3 text-muted-foreground'>{smallDate(bar.timestamp)}</td>
                                    <td className='px-4 py-3 text-muted-foreground wrap-break-word'>{bar.note}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
