import HoneyFields from '../client/honeyFields'

export default function HoneyForm({ defaultValues }: { defaultValues?: GetHoneyProps }) {
    return (
        <HoneyFields
            defaultValues={defaultValues}
        />
    )
}
