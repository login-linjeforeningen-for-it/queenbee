'use client'

import { useState } from 'react'
import { Button, Input, Select } from 'uibee/components'

export default function LocationFormInputsClient({ defaultValues, locationTypes }: {
    defaultValues?: GetLocationProps
    locationTypes: LocationTypes[]
}) {
    const [formValues, setFormValues] = useState({
        name_no: defaultValues?.name_no ?? '',
        name_en: defaultValues?.name_en ?? '',
        url: defaultValues?.url ?? '',
        type: defaultValues?.type ?? '',
        mazemap_campus_id: defaultValues?.mazemap_campus_id ?? 0,
        mazemap_poi_id: defaultValues?.mazemap_poi_id ?? 0,
        coordinate_lat: defaultValues?.coordinate_lat ?? 0,
        coordinate_long: defaultValues?.coordinate_lon ?? 0,
        address_street: defaultValues?.address_street ?? '',
        address_postcode: defaultValues?.address_postcode ?? 0,
        city_name: defaultValues?.city_name ?? '',
    })

    const [mazemapURL, setMazemapURL] = useState('')

    function example() {
        setFormValues(sampleEventLocation)
    }

    return (
        <div className='grid grid-cols-1 pt-10 relative'>
            <div className='absolute flex flex-row gap-4 w-full justify-end'>
                <Button
                    color='secondary'
                    text='Example'
                    icon='+'
                    onClick={example}
                />
            </div>
            <Input
                name='name_no'
                type='text'
                label='Name (Norwegian)'
                value={formValues.name_no}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        name_no: e.target.value,
                    })
                }
                required
            />
            <Input
                name='name_en'
                type='text'
                label='Name (English)'
                value={formValues.name_en}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        name_en: e.target.value,
                    })
                }
                required
            />
            <Input
                name='url'
                type='text'
                label='URL'
                value={formValues.url}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        url: e.target.value,
                    })
                }
            />
            <Select
                name='type'
                label='Location'
                options={locationTypes}
                value={formValues.type}
                onChange={(value) =>
                    setFormValues({
                        ...formValues,
                        type: value as location_type,
                    })
                }
                required
            />
            <div className='grid grid-flow-col gap-x-8'>
                {formValues.type === 'mazemap' && <>
                    <Input
                        name='mazemap_campus_id'
                        type='number'
                        label='Campus ID'
                        value={formValues.mazemap_campus_id}
                        onChange={(e) =>
                            setFormValues({
                                ...formValues,
                                mazemap_campus_id: Number(e.target.value),
                            })
                        }
                        required
                    />
                    <Input
                        name='mazemap_poi_id'
                        type='number'
                        label='POI ID'
                        value={formValues.mazemap_poi_id}
                        onChange={(e) =>
                            setFormValues({
                                ...formValues,
                                mazemap_poi_id: Number(e.target.value),
                            })
                        }
                        required
                    />
                </>
                }
                {formValues.type === 'coords' && <>
                    <Input
                        name='coordinate_lat'
                        type='text'
                        label='Latitude'
                        value={formValues.coordinate_lat}
                        onChange={(e) =>
                            setFormValues({
                                ...formValues,
                                coordinate_lat: Number(e.target.value),
                            })
                        }
                        required
                    />
                    <Input
                        name='coordinate_long'
                        type='number'
                        label='Longitude'
                        value={formValues.coordinate_long}
                        onChange={(e) =>
                            setFormValues({
                                ...formValues,
                                coordinate_long: Number(e.target.value),
                            })
                        }
                        required
                    />
                </>
                }
                {formValues.type === 'address' && <>
                    <Input
                        name='address_street'
                        type='text'
                        label='Address'
                        value={formValues.address_street}
                        onChange={(e) =>
                            setFormValues({
                                ...formValues,
                                address_street: e.target.value,
                            })
                        }
                        required
                    />
                    <Input
                        name='address_postcode'
                        type='number'
                        label='Postal Code'
                        value={formValues.address_postcode}
                        onChange={(e) =>
                            setFormValues({
                                ...formValues,
                                address_postcode: Number(e.target.value),
                            })
                        }
                        required
                    />
                    <Input
                        name='city_name'
                        type='text'
                        label='City'
                        value={formValues.city_name}
                        onChange={(e) =>
                            setFormValues({
                                ...formValues,
                                city_name: e.target.value,
                            })
                        }
                        required
                    />
                </>
                }
            </div>
            {formValues.type === 'mazemap' && (
                <div className=''>
                    <Input
                        name='notUsed'
                        type='text'
                        label='Get from Mazemap URL'
                        value={mazemapURL}
                        onChange={(e) => {
                            const url = e.target.value
                            console.log(url)
                            setMazemapURL(
                                e.target.value,
                            )
                            if(url.startsWith('https://use.mazemap.com')) {
                                const urlObj = new URL(url)
                                console.log(urlObj)
                                const hashParams = new URLSearchParams(urlObj.hash.substring(1))
                                const campusID = hashParams.get('campusid')
                                const poiID = hashParams.get('sharepoi')
                                if(campusID) {
                                    console.log(`Campus ID: ${campusID}`)
                                    setFormValues((prev) => ({
                                        ...prev,
                                        mazemap_campus_id: Number(campusID),
                                    }))
                                }
                                if(poiID) {
                                    console.log(`POI ID: ${poiID}`)
                                    setFormValues((prev) => ({
                                        ...prev,
                                        mazemap_poi_id: Number(poiID),
                                    }))
                                }
                            }
                        }}
                    />
                    <p className='text-sm text-login-100 mt-1'>This will auto-fill the Campus ID and POI ID from the Mazemap URL</p>
                </div>
            )}
        </div>
    )
}

const sampleEventLocation = {
    name_no: '🍊 Login Loungen',
    name_en: '🍊 Login Lounge',
    url: 'https://login.no/',
    type: 'coords' as location_type,
    mazemap_campus_id: 55,
    mazemap_poi_id: 229153,
    coordinate_lat: 60.787,
    coordinate_long: 10.6815,
    address_street: 'Teknologivegen 22',
    address_postcode: 2815,
    city_name: 'Gjøvik',
}
