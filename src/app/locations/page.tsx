'use client'
import List from '@components/list/list'
import Modal from '@components/modal/modal'
import Button from '@components/userInput/button'
import Filter from '@components/userInput/filter'
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

export default function page() {
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
    const [filterText, setFilterText] = useState('')
    const [modal, setModal] = useState(false)

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
        <div className={`max-w-[calc(100vw-var(--w-sidebar)-2rem)] h-[var(--h-pageInfo)] ${list.length ? '' : 'h-full'}`}>
            <h1 className="font-semibold text-lg">Locations</h1>
            <div className="flex justify-between pb-4 min-h-[5vh] max-h-[6vh]">
                {list.length <= 0 && <div></div>}
                {list.length > 0 && <Filter text={filterText} setText={setFilterText} />}
                {list.length > 0 && <div className='flex gap-4'>
                    <Option value={Location.Address} active={active} setActive={setActive} />
                    <Option value={Location.Coordinate} active={active} setActive={setActive} />
                    <Option value={Location.Mazemap} active={active} setActive={setActive} />
                </div>}
                <Button text="Create New" icon='+' handleClick={() => setModal(true)} />
            </div>
            {list.length > 0 && active === Location.Address && <List sticky={addressSticky} list={list} visible={addressVisible} />}
            {list.length > 0 && active === Location.Mazemap && <List sticky={mazemapSticky} list={list} visible={mazemapVisible} />}
            {list.length > 0 && active === Location.Coordinate && <List sticky={coordinateSticky} list={list} visible={coordinateVisible} />}
            {list.length <= 0 && <div className="grid place-items-center self-center h-full">
                <h1>Fant ingen jobber.</h1>
            </div>}
            <Modal display={modal} close={() => setModal(false)}>
                <div className='w-full h-full'>
                    <h1>lager nytt location...</h1>
                </div>
            </Modal>
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
                className={`cursor-pointer px-2 p-1 ${isActive ? 'text-login' : 'text-superlight'}`} 
                onClick={(() => handleClick(value))}
            >
                {`${value[0].toUpperCase()}${value.slice(1)}`}
            </h1>
            <div className={`w-full ${isActive ? 'bg-login' : ''} h-[1px]`} />
        </div>
    )
}
