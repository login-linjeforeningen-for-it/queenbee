import { getLocations } from '@utils/api'
import Alert from '@components/alert/alert'
import Button from '@components/userInput/button'
import Filter from '@components/userInput/filter'
import Table from '@components/table/table'
import LocationOption from '@components/locationOption/locationOption'
import { cookies } from 'next/headers'

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
    // const search = typeof filters.q === 'string' ? filters.q : ''
    // const page = typeof filters.page === 'string' ? Number(filters.page) : 0
    // const offset = typeof filters.offset === 'string' ? Number(filters.offset) : 0
    
    const cookieLocation = cookieStore.get('location')?.value
    const activeType = 
        typeof cookieLocation === 'string' && Object.values(Location).includes(cookieLocation as Location)
            ? cookieLocation as Location
            : typeof filters.t === 'string' && Object.values(Location).includes(filters.t as Location)
                ? filters.t as Location
                : Location.Address

    const list = await getLocations(LocationAPI[activeType])

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
                        <Button text='New organization' icon='+' path='locations/create' />
                    </div>
                </div>
            </div>
            {typeof list === 'string' || list.length <= 0 ?
                <div className='w-full h-full flex items-center justify-center'>
                    <Alert>
                        {typeof list === 'string' ? list : 'No locations found'}
                    </Alert>
                </div> 
                :
                <>
                    {activeType === Location.Address        && <Table list={list} headers={['id', 'name_no', 'address_street', 'address_postcode', 'city_name', 'url', 'updated_at']} />}
                    {activeType === Location.Mazemap        && <Table list={list} headers={['id', 'name_no', 'mazemap_campus_id', 'mazemap_poi_id', 'url', 'updated_at']} />}
                    {activeType === Location.Coordinate     && <Table list={list} headers={['id', 'name_no', 'coordinate_lat', 'coordinate_long', 'url', 'updated_at']} />}
                </>
            }
        </div>
    )
}