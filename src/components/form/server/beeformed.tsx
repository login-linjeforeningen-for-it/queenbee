import BeeFormedInputsClient from '../client/beeformed'

export default function BeeFormedFormInputs({
    defaultValues
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues?: any
}) {

    return (
        <BeeFormedInputsClient
            defaultValues={defaultValues}
        />
    )
}
