import daysTillCertificateExpiry from '@utils/fetch/status/daysTillCertificateExpiry'
import { CheckCircle, CircleAlert } from 'lucide-react'
import { LeftBarPanel } from 'uibee/components'

export default function CertificateStatus({ service }: { service: Service }) {
    if (!service.certificate) {
        return (
            <LeftBarPanel color='border-l-red-500' className='flex items-center gap-2 px-2.5 py-1.5 text-sm text-red-300'>
                <CircleAlert className='w-4 h-4 stroke-red-400' />
                <span>No Certificate</span>
            </LeftBarPanel>
        )
    }

    if (!service.certificate.valid) {
        return (
            <LeftBarPanel color='border-l-red-500' className='flex items-center gap-2 px-2.5 py-1.5 text-sm text-red-300'>
                <CircleAlert className='w-4 h-4 stroke-red-400' />
                <span>Invalid Certificate</span>
            </LeftBarPanel>
        )
    }

    const cert = service.certificate as Certificate
    const selfSigned = cert.issuer.cn === cert.subjectCN

    if (selfSigned) {
        return (
            <LeftBarPanel color='border-l-orange-500' className='flex items-center gap-2 px-2.5 py-1.5 text-sm text-orange-300'>
                <CircleAlert className='w-4 h-4 stroke-orange-400' />
                <span>Self-signed Certificate</span>
            </LeftBarPanel>
        )
    }

    const soonToExpire = daysTillCertificateExpiry(cert) < 30

    if (soonToExpire) {
        return (
            <LeftBarPanel color='border-l-red-500' className='flex items-center gap-2 px-2.5 py-1.5 text-sm text-red-300'>
                <CircleAlert className='w-4 h-4 stroke-red-400' />
                <span>Expires in under 30 days</span>
            </LeftBarPanel>
        )
    }

    return (
        <LeftBarPanel color='border-l-green-500' className='flex items-center gap-2 px-2.5 py-1.5 text-sm text-green-300'>
            <CheckCircle className='w-4 h-4 stroke-green-400' />
            <span>Valid Certificate</span>
        </LeftBarPanel>
    )
}
