import ListPage, { listResult } from '@components/table/listPage'
import ManagedTable from '@components/table/managedTable'
import deleteLocation from '@utils/api/workerbee/locations/deleteLocation'
import getLocations from '@utils/api/workerbee/locations/getLocations'
import { cookies } from 'next/headers'

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
    return await deleteLocation(Number(id))
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

    const { data, totalRows, error } = listResult(locations, 'locations')
    const columnMap = {
        [Location.Address]: AddressColumns,
        [Location.Mazemap]: MazemapColumns,
        [Location.Coordinate]: CoordinateColumns,
        [Location.Digital]: DigitalColumns,
    }

    return (
        <ListPage
            title={<>Locations - <span className='capitalize'>{activeType}</span></>}
            createText='New location'
            createPath='locations/create'
        >
            <ManagedTable
                error={error}
                data={data}
                columns={columnMap[activeType]}
                deleteAction={deleteAction}
                redirectPath='/locations/update'
                totalRows={totalRows}
                pageSize={limit}
            />
        </ListPage>
    )
}
