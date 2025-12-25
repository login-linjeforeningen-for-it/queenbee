import daysTillCertificateExpiry from '@utils/fetch/status/daysTillCertificateExpiry'
import { CheckCircle, CircleAlert } from 'lucide-react'

export default function CertificateDetails({ service }: { service: Service }) {
    if (!service.certificate) {
        return
    }

    const boxStyle = 'rounded-lg w-full bg-login-50/5 p-2'
    if (!service.certificate.valid) {
        return (
            <div className={boxStyle}>
                <h1>{JSON.stringify(service.certificate)}</h1>
                <div className={boxStyle}>
                    <div className='flex justify-between'>
                        <h1 className='font-semibold'>Certificate</h1>
                        <CircleAlert className='stroke-red-500 w-5' />
                    </div>
                    <h1>{service.certificate.valid}</h1>
                    <h1>{service.certificate.code}</h1>
                    <h1>{service.certificate.message}</h1>
                    <h1>{service.certificate.reason}</h1>
                    <h1>{service.certificate.service}</h1>
                </div>
            </div>
        )
    }

    const daysTillExpiry = daysTillCertificateExpiry(service.certificate)

    return (
        <div>
            <div className={boxStyle}>
                <div className='flex justify-between'>
                    <h1 className='font-semibold'>Certificate</h1>
                    {daysTillExpiry < 30
                        ? <CircleAlert className='stroke-yellow-500 w-5' /> : <CheckCircle className='stroke-green-500 w-5' />}
                </div>

                {/* Certificate details */}
                <div className='grid grid-cols-2 gap-y-3 gap-x-6'>
                    <div>
                        <h2 className='text-login-50 text-sm'>Subject CN</h2>
                        <p className='text-login-200 text-sm'>{service.certificate.subjectCN}</p>
                    </div>

                    <div>
                        <h2 className='text-login-50 text-sm'>DNS Names</h2>
                        <p className='text-login-200 text-sm'>{service.certificate.dnsNames}</p>
                    </div>

                    <div>
                        <h2 className='text-login-50 text-sm'>Issued By</h2>
                        <p className='text-login-200 text-sm'>
                            {service.certificate.issuer.name} ({service.certificate.issuer.cn})
                        </p>
                    </div>

                    <div>
                        <h2 className='text-login-50 text-sm'>Key Type</h2>
                        <p className='text-login-200 text-sm'>{service.certificate.keyType}</p>
                    </div>

                    <div>
                        <h2 className='text-login-50 text-sm'>Valid From</h2>
                        <p className='text-login-200 text-sm'>{service.certificate.validFrom}</p>
                    </div>

                    <div>
                        <h2 className='text-login-50 text-sm'>Valid To</h2>
                        <p className='text-login-200 text-sm'>
                            {service.certificate.validTo} ({daysTillExpiry.toFixed(0)}d)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
