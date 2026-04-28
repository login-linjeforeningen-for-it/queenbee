import AlertFields from '../client/alertFields'

export default function AlertForm({ defaultValues }: { defaultValues?: GetAlertProps }) {
    return <AlertFields
        defaultValues={defaultValues}
    />
}
