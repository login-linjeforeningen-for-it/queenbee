import { Dispatch, SetStateAction, useState } from 'react'
import NewNotification from './newNotification'
import PostWebhookConfirmationDialog from './postWebhookConfirmationDialog'
import NewServiceForm from './newServiceForm'
import { getService } from '@utils/api'

type NewServiceProps = {
    notifications: ServiceNotification[]
    setRefresh: Dispatch<SetStateAction<boolean>>
    setSelected: Dispatch<SetStateAction<Service | null>>
    service: Service | null
    setService: Dispatch<SetStateAction<Service | null>>
    setRefreshNotifications: Dispatch<SetStateAction<boolean>>
    services: Service[]
    setAdding: Dispatch<SetStateAction<boolean>>
}

export default function NewService({
    services,
    service,
    setService,
    notifications,
    setRefresh,
    setSelected,
    setRefreshNotifications,
    setAdding
}: NewServiceProps) {
    const [addingNotification, setAddingNotification] = useState(false)
    const initialForm = {
        name: '',
        type: 'fetch' as 'fetch' | 'post',
        url: '',
        interval: 60,
        status: false,
        userAgent: null,
        expectedDown: false,
        notification: null,
        maxConsecutiveFailures: 0,
        note: '',
        enabled: true,
    }

    const [form, setForm] = useState<NewService>(initialForm)

    function clearForm() {
        setForm(initialForm)
    }

    async function handleCloseWebhook() {
        clearForm()
        setRefresh(true)

        if (service) {
            const found = services.find((s) => s.id === service.id)
            if (found) {
                setSelected(found)
                setAdding(false)
            } else {
                const newService = await getService(service.id)
                if (newService && typeof newService !== 'string') {
                    setSelected(newService)
                    setAdding(false)
                }
            }
        }
    }

    return (
        <div className='w-full space-y-4'>
            <NewNotification
                display={addingNotification}
                setAddingNotification={setAddingNotification}
                setRefresh={setRefreshNotifications}
            />
            <PostWebhookConfirmationDialog
                service={service}
                onClick={handleCloseWebhook}
            />
            <NewServiceForm
                form={form}
                service={service}
                setForm={setForm}
                notifications={notifications}
                clearForm={clearForm}
                setRefresh={setRefresh}
                setService={setService}
                setAddingNotification={setAddingNotification}
            />
        </div>
    )
}
