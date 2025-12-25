import useClearStateAfter from '@/hooks/useClearStateAfter'
import config from '@config'
import { Check, Copy } from 'lucide-react'
import { Button } from 'uibee/components'

type PostWebhookConfirmationDialogProps = {
    service: Service | null
    onClick: () => void
}

export default function PostWebhookConfirmationDialog({ service, onClick }: PostWebhookConfirmationDialogProps) {
    const copyText = `${config.beekeeper.api}${config.beekeeper.status.services.post}/${service?.id}`
    const { condition: copy, setCondition: setCopy } = useClearStateAfter({ timeout: 500 })

    if (!service) {
        return
    }

    return (
        <div className='w-fit space-y-2'>
            <h1 className='text-lg font-semibold'>Created service {service.name}</h1>
            <label className='block text-sm font-medium'>Send updates to</label>
            <h1
                className='w-full rounded bg-login-50/5 px-3 py-2 flex gap-2 cursor-pointer text-login-100'
                onClick={() => { setCopy(true); navigator.clipboard.writeText(copyText) }}
            >
                <Copy className={`w-5 text-login-50 ${copy && 'stroke-green-500'}`} />
                {copyText}
            </h1>
            <Button icon={<Check className='w-5' />} text='Continue' onClick={onClick} />
        </div>
    )
}
