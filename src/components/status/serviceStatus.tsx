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
        <>
            <div className='flex w-full justify-between items-center'>
                <h1 className='text-xl font-semibold'>{service.name}</h1>
                <CertificateStatus service={service} />
            </div>
            <CertificateDetails service={service} />
            <table className='rounded-lg w-full p-2 bg-login-50/5'>
                <thead>
                    <tr className='text-left'>
                        <th className='pl-2 w-50'>Name</th>
                        <th className='pl-2 w-20'>Status</th>
                        <th className='pl-2 w-40'>Time</th>
                        <th className='pl-2'>Message</th>
                    </tr>
                </thead>
                <tbody>
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
                            <tr key={index}>
                                <td className='px-2 overflow-auto noscroll'>{service.name}</td>
                                <td className='px-2 py-1'>
                                    <span className={`
                                        inline-flex items-center justify-center 
                                        text-xs w-full min-h-full outline
                                        px-2 rounded-md py-0.5 font-medium
                                        ${barOutlineColor(bar, service.maxConsecutiveFailures, status)} 
                                        `}>
                                        {status}
                                    </span>
                                </td>
                                <td className='px-2 py-1'>{smallDate(bar.timestamp)}</td>
                                <td className='px-2 overflow-auto noscroll'>{bar.note}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}
