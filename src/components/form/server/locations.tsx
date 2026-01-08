import LocationFormInputsClient from '../client/locations'

export default function LocationFormInputs({ defaultValues }: { defaultValues?: GetLocationProps }) {
    const locationTypes: { label: string; value: location_type }[] = [
        { label: 'Mazemap', value: 'mazemap' },
        { label: 'Coordinates', value: 'coords' },
        { label: 'Address', value: 'address' },
        { label: 'Digital', value: 'digital' },
    ]

    return (
        <LocationFormInputsClient
            defaultValues={defaultValues}
            locationTypes={locationTypes}
        />
    )
}
