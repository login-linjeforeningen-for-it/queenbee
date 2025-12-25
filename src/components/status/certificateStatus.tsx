import daysTillCertificateExpiry from '@utils/fetch/status/daysTillCertificateExpiry'
import { CheckCircle, CircleAlert } from 'lucide-react'

export default function CertificateStatus({ service }: { service: Service }) {
    if (!service.certificate) {
        return
    }

    const soonToExpire = daysTillCertificateExpiry(service.certificate as Certificate) < 30
    const baseStyle = 'cursor-pointer text-sm outline rounded-lg px-2 items-center flex gap-2 select-none'

    if (service.certificate.valid) {
        return (
            <button className={`
                    bg-green-500/50 hover:bg-green-500/70 ${baseStyle}
                    outline-green-500/90 hover:outline-green-500
            `}>
                <CheckCircle className='stroke-green-500 w-5' /> Valid Certificate
            </button>
        )
    }

    if (soonToExpire) {
        return (
            <button className={`
                bg-red-500/50 hover:bg-red-500/70 ${baseStyle}
                outline-red-500/90 hover:outline-red-500
            `}><CircleAlert className='stroke-red-500 w-5' /> Certificate expires in less than a month</button>
        )
    }

    return (
        <button className={`
            bg-red-500/50 hover:bg-red-500/70 ${baseStyle}
            outline-red-500/90 hover:outline-red-500
        `}><CircleAlert className='stroke-red-500 w-5' /> Invalid Certificate</button>
    )
}
