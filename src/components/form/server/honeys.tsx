import HoneyFormInputsClient from '../client/honeys'

export default function HoneyFormInputs({ defaultValues }: { defaultValues?: GetHoneyProps }) {
    return (
        <HoneyFormInputsClient
            defaultValues={defaultValues}
        />
    )
}
