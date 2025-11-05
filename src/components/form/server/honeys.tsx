import HoneyFormInputsClient from '../client/honeys'

export default function HoneyFormInputs({ defaultValues, parent }: { defaultValues?: GetHoneyProps, parent?: { preview?: boolean }}) {
    return (
        <HoneyFormInputsClient
            defaultValues={defaultValues}
            preview={parent?.preview}
        />
    )
}
