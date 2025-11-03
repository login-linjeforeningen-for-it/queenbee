import Album from '@components/album/album'
import Search from '@components/inputs/search'
import UploadAlbumImages from '@components/inputs/uploadAlbumImages'
import BackButton from '@components/navigation/back'
import Pagination from '@components/table/pagination'
import { deleteAlbumImage, getAlbum } from '@utils/api'
import { notFound } from 'next/navigation'

async function deleteAction(id: string, name: string): Promise<DeleteParamsProps | string> {
    'use server'
    return await deleteAlbumImage(Number(id), name)
}

export default async function Page({ params }: { params: Promise<{ id: string }>}) {
    const { id } = await params
    const pageSize = 15

    if (id) {
        const album = await getAlbum(Number(id))
        if (typeof album !== 'string') {
            return (
                <div className='flex flex-col h-full'>
                    <div className='flex flex-col gap-4'>
                        <BackButton pushURL={`/dashboard/albums/update/${album.id}`} />
                        <h1 className='text-lg font-bold mb-4'>
                            Album: {album.name_en}
                        </h1>
                    </div>
                    <div className='flex justify-between items-center pb-10'>
                        <Search className='w-fit' />
                        <UploadAlbumImages albumId={album.id} />
                    </div>
                    {album.images &&
                        <Album
                            album={album}
                            pageSize={pageSize}
                            deleteAction={deleteAction}
                        />
                    }
                    {album.images &&
                        <Pagination
                            totalRows={album.images.length}
                            pageSize={pageSize}
                        />
                    }
                </div>
            )
        }

        notFound()
    }

    notFound()
}