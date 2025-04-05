'use client'
import List from '@components/list/list'
import { getLocations } from '@utils/api'
import { getCookie, setCookie } from '@utils/cookies'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

enum Location {
    Address = 'address',
    Mazemap = 'mazemap',
    Coordinate = 'coordinate'
}

type OptionProps = {
    value: Location
    active: Location
    setActive: Dispatch<SetStateAction<Location>>
}

export default function Page() {
    const [active, setActive] = useState<Location>(Location.Address)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [locations, setLocations] = useState<any[]>([])
    const [list, setList] = useState(locations.filter((location) => location.type === active))
    const addressVisible = ['id', 'name_no', 'address_street', 'address_postcode', 'city_name', 'url', 'updated_at']
    const addressSticky = ['id']
    const mazemapVisible = ['id', 'name_no', 'mazemap_campus_id', 'mazemap_poi_id', 'url', 'updated_at']
    const mazemapSticky = ['id']
    const coordinateVisible = ['id', 'name_no', 'mazemap_campus_id', 'mazemap_poi_id', 'url', 'updated_at']
    const coordinateSticky = ['id']

    useEffect(() => {
        (async() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any[] = await getLocations(null, 200)
            if (response) {
                setLocations(response)
            }

            const activeResponse = getCookie('location') as Location || Location.Address
            if (activeResponse) {
                setActive(activeResponse)
            }
        })()
    }, [])

    useEffect(() => {
        setList(locations.filter((location) => active === Location.Coordinate ? location.type === 'coords' : location.type === active))
    }, [locations, active])
    
    return (
        <div>
            <h1 className="font-semibold text-lg">Locations</h1>
            <div className="flex justify-between pb-4 min-h-[5vh] max-h-[6vh]">
                <h1>Filter (for text only)</h1>
                <div className='flex gap-4'>
                    <Option value={Location.Address} active={active} setActive={setActive} />
                    <Option value={Location.Coordinate} active={active} setActive={setActive} />
                    <Option value={Location.Mazemap} active={active} setActive={setActive} />
                </div>
                <h1>Create new button</h1>
            </div>
            {active === Location.Address && <List sticky={addressSticky} list={list} visible={addressVisible} />}
            {active === Location.Mazemap && <List sticky={mazemapSticky} list={list} visible={mazemapVisible} />}
            {active === Location.Coordinate && <List sticky={coordinateSticky} list={list} visible={coordinateVisible} />}
        </div>
    )
}

function Option ({value, active, setActive}: OptionProps) {
    const isActive = value === active
    function handleClick(value: Location) {
        setActive(value)
        setCookie('location', value)
    }

    return (
        <div className={`${isActive ? 'bg-login/20' : ''} rounded-lg`}>
            <h1 
                className={`cursor-pointer px-2 p-1 ${isActive ? 'text-login' : 'text-extralight'}`} 
                onClick={(() => handleClick(value))}
            >
                {`${value[0].toUpperCase()}${value.slice(1)}`}
            </h1>
            <div className={`w-full ${isActive ? 'bg-login' : ''} h-[1px]`} />
        </div>
    )
}
