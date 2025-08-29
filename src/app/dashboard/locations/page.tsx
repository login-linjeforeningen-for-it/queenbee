import { deleteLocation, getLocations } from '@utils/api'
import Alert from '@components/alert/alert'
import Button from '@components/userInput/button'
import Search from '@components/inputs/search'
import Table from '@components/table/table'
import LocationOption from '@components/locationOption/locationOption'
import { cookies } from 'next/headers'
import Pagination from '@components/table/pagination'

const AddressHeaders = [
    'id',
    'name_no',
    'address_street',
    'address_postcode',
    'city_name',
    'url',
    'updated_at',
]

const MazemapHeaders = [
    'id',
    'name_no',
    'mazemap_campus_id',
    'mazemap_poi_id',
    'url',
    'updated_at',
]

const CoordinateHeaders = [
    'id',
    'name_no',
    'coordinate_lat',
    'coordinate_long',
    'url',
    'updated_at',
]

enum Location {
    Address = 'address',
    Mazemap = 'mazemap',
    Coordinate = 'coordinate',
}

enum LocationAPI {
    address = 'address',
    mazemap = 'mazemap',
    coordinate = 'coords',
}

type TempSortProps = {
    tempSort: object[]
    activeType: Location
}

async function deleteAction(id: string) {
    'use server'
    await deleteLocation(Number(id))
}

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const cookieStore = await cookies()

    const filters = await searchParams
    // const search = typeof filters.q === 'string' ? filters.q : ''
    // const page = typeof filters.page === 'string' ? Number(filters.page) : 1

    const cookieLocation = cookieStore.get('location')?.value
    // prettier-ignore
    const activeType =
        typeof cookieLocation === 'string' &&
            Object.values(Location).includes(cookieLocation as Location)
            ? (cookieLocation as Location)
            : typeof filters.t === 'string' &&
                Object.values(Location).includes(filters.t as Location)
                ? (filters.t as Location)
                : Location.Address

    const list = await getLocations(LocationAPI[activeType])
    const tempSort = Array.isArray(list)
        ? list.filter((item) => !item.is_deleted)
        : []

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
            <TempSort tempSort={tempSort} activeType={activeType} />
        </div>
    )
}

function TempSort({ tempSort, activeType }: TempSortProps) {
    if (
        typeof tempSort === 'string' ||
        !Array.isArray(tempSort) ||
        tempSort.length < 1
    ) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <Alert>
                    {typeof tempSort === 'string'
                        ? tempSort
                        : 'No locations found'}
                </Alert>
            </div>
        )
    }
    return (
        <div className='flex-1 flex flex-col overflow-hidden'>
            {activeType === Location.Address && (
                <Table
                    list={tempSort}
                    headers={AddressHeaders}
                    deleteAction={deleteAction}
                />
            )}
            {activeType === Location.Mazemap && (
                <Table
                    list={tempSort}
                    headers={MazemapHeaders}
                    deleteAction={deleteAction}
                />
            )}
            {activeType === Location.Coordinate && (
                <Table
                    list={tempSort}
                    headers={CoordinateHeaders}
                    deleteAction={deleteAction}
                />
            )}
            <Pagination pageSize={10} totalRows={tempSort.length} />
        </div>
    )
}
