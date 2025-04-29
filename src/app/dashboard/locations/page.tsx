import { getLocations } from '@utils/api'
import Alert from '@components/alert/alert'
import FilterList from '@components/filterList/filterList'
import List from '@components/list/list'
import Button from '@components/userInput/button'
import Filter from '@components/userInput/filter'
import LocationOption from '@components/locationOption/locationOption'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Delete from '@components/svg/delete'

enum Location {
    Address = 'address',
    Mazemap = 'mazemap',
    Coordinate = 'coordinate'
}

enum LocationAPI {
    address = 'address',
    mazemap ='mazemap',
    coordinate = 'coords'
}

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const cookieStore = await cookies()
    
    const filters = await searchParams
    const filterText = typeof filters.q === 'string' ? filters.q : ''
    const hasSelectedItems = typeof filters.selected === 'string' ? filters.selected?.split(',').length > 0 : false
    const pageNumber = typeof filters.p === 'string' ? Number(filters.p) : 0
    const cookieLocation = cookieStore.get('location')?.value
    const activeType = 
        typeof cookieLocation === 'string' && Object.values(Location).includes(cookieLocation as Location)
            ? cookieLocation as Location
            : typeof filters.t === 'string' && Object.values(Location).includes(filters.t as Location)
                ? filters.t as Location
                : Location.Address

    const limit = 200
    const listLimit = 10
    const list = await getLocations(LocationAPI[activeType],limit)

    if(typeof list === 'string') return (
        <div className='w-full h-full flex items-center justify-center'>
            <Alert>
                Error loading locations
            </Alert>
        </div>
    )

    const filteredList = filterText !== '' ? FilterList({ list, filterText }).splice(0,listLimit) : list.splice(0,listLimit)
    const addressVisible    = ['id', 'name_no', 'address_street', 'address_postcode', 'city_name', 'url', 'updated_at']
    const addressSticky     = ['id']
    const mazemapVisible    = ['id', 'name_no', 'mazemap_campus_id', 'mazemap_poi_id', 'url', 'updated_at']
    const mazemapSticky     = ['id']
    const coordinateVisible = ['id', 'name_no', 'coordinate_lat', 'coordinate_long', 'url', 'updated_at']
    const coordinateSticky  = ['id']

    return (
        <div className='h-full max-w-[calc(100vw-var(--w-sidebar)-2rem)] overflow-hidden'>
            <div className='h-[var(--h-pageInfo)]'>
                <h1 className='font-semibold text-lg'>Locations</h1>
                <div className='flex justify-between pb-4'>
                    <Filter/>
                    <div className='flex gap-4'>
                        <LocationOption value={Location.Address} active={activeType}/>
                        <LocationOption value={Location.Coordinate} active={activeType}/>
                        <LocationOption value={Location.Mazemap} active={activeType}/>
                    </div>
                    <div className='flex flex-row gap-[1rem]'>
                        <Button text='New organization' icon='+' path='locations/0' />
                        {hasSelectedItems &&
                            <Link href='' className='bg-red-900 cursor-pointer px-4 rounded-md h-8 flex justify-evenly items-center gap-2 select-none'>
                                <Delete className='fill-bright'/>
                                Delete selected
                            </Link>
                        }
                    </div>
                </div>
            </div>
            {filteredList.length > 0 && activeType === Location.Address && <List sticky={addressSticky} list={filteredList} visible={addressVisible} />}
            {filteredList.length > 0 && activeType === Location.Mazemap && <List sticky={mazemapSticky} list={filteredList} visible={mazemapVisible} />}
            {filteredList.length > 0 && activeType === Location.Coordinate && <List sticky={coordinateSticky} list={filteredList} visible={coordinateVisible} />}
            {filteredList.length <= 0 && 
            <div className='w-full h-full flex items-center justify-center'>
                <Alert>
                    Could not find locations
                </Alert>
            </div>
            }
        </div>
    )
}
