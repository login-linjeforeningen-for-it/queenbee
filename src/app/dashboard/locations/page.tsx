import { deleteLocation, getLocations } from '@utils/api'
import Alert from '@components/alert/alert'
import Button from '@components/button/button'
import Search from '@components/inputs/search'
import Table from '@components/table/table'
import LocationOption from '@components/locationOption/locationOption'
import { cookies } from 'next/headers'
import Pagination from '@components/table/pagination'

const AddressHeaders = [
    'id',
    'name_en',
    'address_street',
    'address_postcode',
    'city_name',
    'updated_at',
]

const MazemapHeaders = [
    'id',
    'name_en',
    'mazemap_campus_id',
    'mazemap_poi_id',
    'updated_at',
]

const CoordinateHeaders = [
    'id',
    'name_en',
    'coordinate_lat',
    'coordinate_long',
    'updated_at',
]

enum Location {
    Address = 'address',
    Mazemap = 'mazemap',
    Coordinate = 'coordinate',
    Digital = 'digital',
}

enum LocationAPI {
    address = 'address',
    mazemap = 'mazemap',
    coordinate = 'coords',
    digital = 'digital',
}

async function deleteAction(id: string) {
    'use server'
    await deleteLocation(Number(id))
}

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const cookieStore = await cookies()
    const filters = await searchParams
    const search = typeof filters.q === 'string' ? filters.q : ''
    const offset = typeof filters.page === 'string' ? Number(filters.page)-1 : 0
    const limit = 14
    const orderBy = typeof filters.column === 'string' ? filters.column : 'id'
    const sort = typeof filters.order === 'string' && (filters.order === 'asc' || filters.order === 'desc')
        ? filters.order
        : 'asc'

    const cookieLocation = cookieStore.get('location')?.value
    // prettier-ignore
    const activeType =
        typeof cookieLocation === 'string' &&
            Object.values(Location).includes(cookieLocation as Location)
            ? (cookieLocation as Location)
            : typeof filters.type === 'string' &&
                Object.values(Location).includes(filters.t as Location)
                ? (filters.type as Location)
                : Location.Address

    const locations = await getLocations({
        type: LocationAPI[activeType],
        search,
        offset,
        limit,
        orderBy,
        sort
    })

    return (
        <div
            className={
                'h-full max-w-[calc(100vw-var(--w-sidebar)-2rem)] ' +
                'overflow-hidden flex flex-col'
            }
        >
            <div className='flex-none'>
                <h1 className='font-semibold text-lg'>Locations</h1>
                <div className='flex items-center justify-between py-3'>
                    <Search />
                    <div className='flex gap-4'>
                        <LocationOption
                            value={Location.Address}
                            active={activeType}
                        />
                        <LocationOption
                            value={Location.Coordinate}
                            active={activeType}
                        />
                        <LocationOption
                            value={Location.Mazemap}
                            active={activeType}
                        />
                        <LocationOption
                            value={Location.Digital}
                            active={activeType}
                        />
                    </div>
                    <div className='flex flex-row gap-[1rem]'>
                        <Button
                            text='New location'
                            icon='+'
                            path='locations/create'
                        />
                    </div>
                </div>
            </div>
            {typeof locations === 'string' || !Array.isArray(locations.locations) || locations.locations.length < 1 ? (
                <div className='w-full h-full flex items-center justify-center'>
                    <Alert>
                        {typeof locations === 'string'
                            ? locations
                            : 'No locations found'}
                    </Alert>
                </div>
            ) : (
                <div className='flex-1 flex flex-col overflow-hidden'>
                    {activeType === Location.Address && (
                        <Table
                            list={locations.locations}
                            headers={AddressHeaders}
                            deleteAction={deleteAction}
                        />
                    )}
                    {activeType === Location.Mazemap && (
                        <Table
                            list={locations.locations}
                            headers={MazemapHeaders}
                            deleteAction={deleteAction}
                        />
                    )}
                    {activeType === Location.Coordinate && (
                        <Table
                            list={locations.locations}
                            headers={CoordinateHeaders}
                            deleteAction={deleteAction}
                        />
                    )}
                    {activeType === Location.Digital && (
                        <Table
                            list={locations.locations}
                            headers={['id', 'name_no', 'url', 'updated_at']}
                            deleteAction={deleteAction}
                        />
                    )}
                    <Pagination pageSize={limit} totalRows={locations.total_count} />
                </div>
            )}
        </div>
    )
}
