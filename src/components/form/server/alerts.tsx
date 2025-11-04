import AlertFormInputsClient from '../client/alerts'

export default function AlertFormInputs({ defaultValues, parent }: { defaultValues?: GetAlertProps, parent?: { preview?: boolean }}) {
    return <AlertFormInputsClient
        defaultValues={defaultValues}
        preview={parent?.preview}
    />
}
