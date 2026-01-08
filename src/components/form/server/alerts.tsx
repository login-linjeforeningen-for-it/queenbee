import AlertFormInputsClient from '../client/alerts'

export default function AlertFormInputs({ defaultValues }: { defaultValues?: GetAlertProps }) {
    return <AlertFormInputsClient
        defaultValues={defaultValues}
    />
}
