import { SearchInput } from 'uibee/components'
import ManagedTable from '@components/table/managedTable'
import deleteLocation from '@utils/api/workerbee/locations/deleteLocation'
import getLocations from '@utils/api/workerbee/locations/getLocations'
import { cookies } from 'next/headers'
import { Button } from 'uibee/components'

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

const AddressColumns = [
    { key: 'id' },
    { key: 'name_en' },
    { key: 'address_street' },
    { key: 'address_postcode' },
    { key: 'city_name' },
    { key: 'updated_at' },
]

const MazemapColumns = [
    { key: 'id' },
    { key: 'name_en' },
    { key: 'mazemap_campus_id' },
    { key: 'mazemap_poi_id' },
    { key: 'updated_at' },
]

const CoordinateColumns = [
    { key: 'id' },
    { key: 'name_en' },
    { key: 'coordinate_lat' },
    { key: 'coordinate_long' },
    { key: 'updated_at' },
]

const DigitalColumns = [
    { key: 'id' },
    { key: 'name_no' },
    { key: 'url' },
    { key: 'updated_at' },
]

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const cookieStore = await cookies()
    const filters = await searchParams
    const search = typeof filters.q === 'string' ? filters.q : ''
    const offset = typeof filters.page === 'string' ? Number(filters.page) - 1 : 0
    const limit = 14
    const orderBy = typeof filters.column === 'string' ? filters.column : 'id'
    const sort = typeof filters.order === 'string' && (filters.order === 'asc' || filters.order === 'desc')
        ? filters.order
        : 'asc'

    const cookieLocation = cookieStore.get('location')?.value

    const activeType = typeof filters.type === 'string' && Object.values(Location).includes(filters.type as Location)
        ? (filters.type as Location)
        : typeof cookieLocation === 'string' && Object.values(Location).includes(cookieLocation as Location)
            ? (cookieLocation as Location)
            : Location.Address

    const locations = await getLocations({
        type: LocationAPI[activeType],
        search,
        offset,
        limit,
        orderBy,
        sort
    })

    const data = typeof locations !== 'string' && Array.isArray(locations.locations) ? locations.locations : []
    const totalRows = typeof locations !== 'string' && Array.isArray(locations.locations) ? locations.total_count : 0
    const columnMap = {
        [Location.Address]: AddressColumns,
        [Location.Mazemap]: MazemapColumns,
        [Location.Coordinate]: CoordinateColumns,
        [Location.Digital]: DigitalColumns,
    }

    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <h1 className='font-semibold text-lg capitalize'>Locations - {activeType}</h1>
                <div className='grid md:flex! items-center justify-between py-3 gap-2'>
                    <SearchInput />
                    <Button
                        text='New location'
                        icon='+'
                        path='locations/create'
                    />
                </div>
            </div>
            <div className='flex-1 flex flex-col overflow-hidden'>
                <ManagedTable
                    data={data as Record<string, unknown>[]}
                    columns={columnMap[activeType]}
                    deleteAction={deleteAction}
                    redirectPath='/locations/update'
                    totalRows={totalRows}
                    pageSize={limit}
                />
            </div>
        </div>
    )
}
