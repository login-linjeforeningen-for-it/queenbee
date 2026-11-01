import Album from '@components/album/album'
import { SearchInput } from 'uibee/components'
import UploadAlbumImages from '@components/inputs/uploadAlbumImages'
import BackButton from '@components/navigation/back'
import { Pagination } from 'uibee/components'
import deleteAlbumImage from '@utils/api/workerbee/albums/deleteAlbumImage'
import getAlbum from '@utils/api/workerbee/albums/getAlbum'
import putCoverImage from '@utils/api/workerbee/albums/putCoverImage'
import { notFound } from 'next/navigation'

async function deleteAction(id: string, name: string): Promise<DeleteParamsProps | string> {
    'use server'
    return await deleteAlbumImage(Number(id), name)
}

async function coverAction(id: string, name: string): Promise<{message: string} | string> {
    'use server'
    return await putCoverImage(Number(id), name)
}

export default async function Page({ params }: { params: Promise<{ id: string }>}) {
    const { id } = await params
    const pageSize = 15

    if (id) {
        const album = await getAlbum(Number(id))
        if (typeof album !== 'string') {
            return (
                <div className='flex flex-col gap-4 pb-8'>
                    <BackButton pushURL={`/albums/update/${album.id}`} />
                    <h1 className='flex h-9 items-center font-semibold text-lg'>
                        Album: {album.name_en}
                    </h1>
                    <UploadAlbumImages albumId={album.id} />
                    <SearchInput />
                    {album.images &&
                        <Album
                            album={album}
                            pageSize={pageSize}
                            deleteAction={deleteAction}
                            coverAction={coverAction}
                        />
                    }
                    {album.images &&
                        <Pagination
                            totalRows={album.images.length}
                            pageSize={pageSize}
                            variant='modern'
                            urlState
                        />
                    }
                </div>
            )
        }

        notFound()
    }

    notFound()
}
