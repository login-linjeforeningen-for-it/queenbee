'use client'

import config from '@config'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

export default function Album({ album }: { album: GetAlbumProps }) {
    const searchParams = useSearchParams()

    const currentPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1
    const search = searchParams.get('q') || ''
    const itemsPerPage = 15

    const filteredImages = album.images.filter((image: string) =>
        image.toLowerCase().includes(search.toLowerCase())
    )

    const offset = (currentPage - 1) * itemsPerPage
    const limit = itemsPerPage
    const paginatedImages = filteredImages.slice(offset, offset + limit)

    return (
        <div className='flex-1'>
            <div className='grid grid-cols-5 gap-4'>
                {paginatedImages.map((image: string) => (
                    <div key={image} className='aspect-[3/2] overflow-hidden rounded-md'>
                        <Image
                            src={`${config.url.CDN_URL}/albums/${album.id}/${image}`}
                            width={150}
                            height={100}
                            alt={`Album Image ${image}`}
                            className='w-full h-full object-cover'
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}