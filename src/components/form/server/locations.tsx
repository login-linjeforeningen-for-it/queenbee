import LocationFields from '../client/locationFields'

export default function LocationForm({ defaultValues }: { defaultValues?: GetLocationProps }) {
    const locationTypes: { label: string; value: location_type }[] = [
        { label: 'Mazemap', value: 'mazemap' },
        { label: 'Coordinates', value: 'coords' },
        { label: 'Address', value: 'address' },
        { label: 'Digital', value: 'digital' },
    ]

    return (
        <LocationFields
            defaultValues={defaultValues}
            locationTypes={locationTypes}
        />
    )
}
