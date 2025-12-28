'use client'

import config from '@config'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'uibee/components'
import { Trash2, Star } from 'lucide-react'
import { Button } from 'uibee/components'

type AlbumProps = {
    album: GetAlbumProps
    pageSize: number
    deleteAction: (id: string, name: string) => Promise<DeleteParamsProps | string>
    coverAction?: (id: string, name: string) => Promise<{message: string} | string>
}

export default function Album({ album, deleteAction, pageSize, coverAction }: AlbumProps) {
    const searchParams = useSearchParams()

    const currentPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1
    const search = searchParams.get('q') || ''
    const itemsPerPage = pageSize

    const [images, setImages] = useState(album.images)

    const filteredImages = images.filter((image: string) =>
        image.toLowerCase().includes(search.toLowerCase())
    )

    const offset = (currentPage - 1) * itemsPerPage
    const limit = itemsPerPage
    const paginatedImages = filteredImages.slice(offset, offset + limit)

    function getDisplayName(filename: string) {
        if (filename.startsWith('img_')) {
            const parts = filename.split('_')
            return parts.slice(2).join('_')
        } else if (filename.startsWith('coverimg_')) {
            const parts = filename.split('_')
            return parts.slice(1).join('_')
        }
        return filename
    }

    const handleDeleteImage = async (imageName: string) => {
        try {
            const response = await deleteAction(album.id.toString(), imageName)
            if (typeof response === 'string') {
                toast.error(`Failed to delete image: ${response}`)
            } else {
                setImages(prev => prev.filter(img => img !== imageName))
                toast.success(response.message || 'Image deleted successfully')
            }
        } catch (error) {
            toast.error(`Failed to delete image: ${(error instanceof Error ? error.message : 'Unknown error')}`)
        }
    }

    const handleSetCoverImage = async (imageName: string) => {
        if (!coverAction) return

        try {
            const response = await coverAction(album.id.toString(), imageName)
            if (typeof response === 'string') {
                toast.error(`Failed to set cover image: ${response}`)
            } else {
                toast.success(response.message || 'Cover image set successfully')
                setImages(prev => {
                    const normalizedImageName = imageName.replace(/^coverimg_/, 'img_')
                    const processed = prev.map(img => img.replace(/^coverimg_/, 'img_'))
                    const targetIndex = processed.indexOf(normalizedImageName)
                    if (targetIndex === -1) return prev

                    const coverImage = `coverimg_${processed[targetIndex].replace(/^img_/, '')}`
                    processed[targetIndex] = coverImage
                    return [coverImage, ...processed.filter((_, i) => i !== targetIndex)]
                })
            }
        } catch (error) {
            toast.error(`Failed to set cover image: ${(error instanceof Error ? error.message : 'Unknown error')}`)
        }
    }

    return (
        <div className='flex-1'>
            <div className='grid grid-cols-5 gap-4'>
                {paginatedImages.map((image: string) => (
                    <div key={image} className='aspect-3/2 overflow-hidden rounded-md relative group'>
                        <Image
                            src={`${config.url.cdn}/albums/${album.id}/${image}`}
                            width={150}
                            height={100}
                            alt={`Album Image ${image}`}
                            className='w-full h-full object-cover'
                        />
                        <div className='absolute bottom-0 left-0 right-0 bg-linear-to-t
                            from-login-600/90 via-login-600/70 to-transparent text-white text-xs p-1 truncate flex items-center gap-1'>
                            {image.startsWith('coverimg_') && <Star size={12} className='text-yellow-400 shrink-0' />}
                            <span className='truncate'>{getDisplayName(image)}</span>
                        </div>
                        <div className='absolute inset-0 bg-login-950/90 bg-opacity-0 group-hover:bg-opacity-50
                            transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100'>
                            <div className='flex gap-2'>
                                {coverAction && (
                                    <Button
                                        icon={<Star size={20} />}
                                        text='Set as cover image'
                                        onClick={() => handleSetCoverImage(image)}
                                    />
                                )}
                                <Button
                                    icon={<Trash2 size={20} />}
                                    text='Delete image'
                                    onClick={() => handleDeleteImage(image)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
