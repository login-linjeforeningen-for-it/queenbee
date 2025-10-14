import BeeFormedInputsClient from '../client/beeformed'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BeeFormedFormInputs({ defaultValues }: { defaultValues?: any }) {

    return (
        <BeeFormedInputsClient
            defaultValues={defaultValues}
        />
    )
}
