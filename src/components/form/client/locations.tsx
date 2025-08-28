'use client'

import Input from '@components/inputs/input'
import Select, { SelectOption } from '@components/inputs/select'
import Button from '@components/userInput/button'
import { useState } from 'react'

export default function LocationFormInputsClient({ 
    defaultValues, 
    locationTypes 
}: { 
    defaultValues?: GetLocationProps
    locationTypes: LocationTypes[]
}) {
    const [formValues, setFormValues] = useState({
        name_no: defaultValues?.name_no ?? '',
        name_en: defaultValues?.name_en ?? '',
        url: defaultValues?.url ?? '',
        type: defaultValues?.type ?? 'address',
        mazemap_campus_id: defaultValues?.mazemap_campus_id ?? 0,
        mazemap_poi_id: defaultValues?.mazemap_poi_id ?? 0,
        coordinate_lat: defaultValues?.coordinate_lat ?? 0,
        coordinate_long: defaultValues?.coordinate_long ?? 0,
        address_street: defaultValues?.address_street ?? '',
        address_postcode: defaultValues?.address_postcode ?? 0,
        city_name: defaultValues?.city_name ?? '',
    })

    function example() {
        setFormValues(sampleEventLocation)
    }

    return (
        <div className='flex flex-col gap-4 relative'>
            <div className='absolute flex flex-row gap-[1rem] -mt-13 w-full justify-end'>
                <Button color="secondary" text='Example' icon='+' onClick={example} />
            </div>
            <Input
                name='name_no'
                type='text'
                label='Name (Norwegian)'
                value={formValues.name_no}
                setValue={(input) => setFormValues({ ...formValues, name_no: input as string })}
                required
            />
            <Input
                name='name_en'
                type='text'
                label='Name (English)'
                value={formValues.name_en}
                setValue={(input) => setFormValues({ ...formValues, name_en: input as string })}
                required
            />
            <Input
                name='url'
                type='text'
                label='URL'
                value={formValues.url}
                setValue={(input) => setFormValues({ ...formValues, url: input as string })}
            />
            <Select
                name='location'
                label='Location'
                options={locationTypes}
                value={formValues.type || ''}
                setValue={(input) => setFormValues({ ...formValues, type: input as location_type })}
                required
            >
                <SelectOption
                    value='mazemap'
                    className='grid grid-flow-col gap-x-8 pt-4'
                >
                    <Input
                        name='mazemap_campus_id'
                        type='number'
                        label='Campus ID'
                        value={formValues.mazemap_campus_id}
                        setValue={(input) => setFormValues({ ...formValues, mazemap_campus_id: Number(input) })}
                        required
                    />
                    <Input
                        name='mazemap_poi_id'
                        type='number'
                        label='POI ID'
                        value={formValues.mazemap_poi_id}
                        setValue={(input) => setFormValues({ ...formValues, mazemap_poi_id: Number(input) })}
                        required
                    />
                </SelectOption>
                <SelectOption
                    value='coords'
                    className='grid grid-flow-col gap-x-8 pt-4'
                >
                    <Input
                        name='coordinate_lat'
                        type='text'
                        label='Latitude'
                        value={formValues.coordinate_lat}
                        setValue={(input) => setFormValues({ ...formValues, coordinate_lat: Number(input) })}
                        required
                    />
                    <Input
                        name='coordinate_long'
                        type='number'
                        label='Longitude'
                        value={formValues.coordinate_long}
                        setValue={(input) => setFormValues({ ...formValues, coordinate_long: Number(input) })}
                        required
                    />
                </SelectOption>
                <SelectOption value='address'
                    className='grid grid-flow-col gap-x-8 pt-4'
                >
                    <Input
                        name='address_street'
                        type='text' label='Address'
                        value={formValues.address_street}
                        setValue={(input) => setFormValues({ ...formValues, address_street: input as string })}
                        required
                    />
                    <Input
                        name='address_postcode'
                        type='number'
                        label='Postal Code'
                        value={formValues.address_postcode}
                        setValue={(input) => setFormValues({ ...formValues, address_postcode: Number(input) })}
                        required
                    />
                    <Input
                        name='city_name'
                        type='text'
                        label='City'
                        value={formValues.city_name}
                        setValue={(input) => setFormValues({ ...formValues, city_name: input as string })}
                        required
                    />
                </SelectOption>
            </Select>
        </div>
    )
}

const sampleEventLocation = {
    name_no: '🍊 Login Loungen',
    name_en: '🍊 Huset',
    url: 'https://login.no/',
    type: 'coords' as location_type,
    mazemap_campus_id: 0,
    mazemap_poi_id: 0,
    coordinate_lat: 60.7870,
    coordinate_long: 10.6815,
    address_street: 'Teknologivegen 22',
    address_postcode: 2815,
    city_name: 'Gjøvik',
}
