import Album from '@components/album/album'
import Search from '@components/inputs/search'
import UploadAlbumImages from '@components/inputs/uploadAlbumImages'
import BackButton from '@components/navigation/back'
import Pagination from '@components/table/pagination'
import { getAlbum } from '@utils/api'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ id: string }>}) {
    const { id } = await params

    if (id) {
        const album = await getAlbum(Number(id))
        if (typeof album !== 'string') {
            return (
                <div className='flex flex-col h-full'>
                    <div className='flex flex-col gap-4'>
                        <BackButton />
                        <h1 className='text-lg font-bold mb-4'>
                            Album: {album.name_en}
                        </h1>
                    </div>
                    <div className='flex justify-between items-center pb-10'>
                        <Search className='w-fit' />
                        <UploadAlbumImages albumId={album.id} />
                    </div>
                    <Album album={album} />
                    <Pagination totalRows={album.images.length} pageSize={20} />
                </div>
            )
        }

        notFound()
    }

    notFound()
}