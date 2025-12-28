'use client'

import Input from '@components/inputs/input'
import getShareURLs from '@utils/api/workerbee/albums/getShareURLs'
import compressAlbums from '@utils/api/workerbee/albums/compressAlbums'
import { toast } from 'uibee/components'
import { useState } from 'react'
import { Upload, Loader } from 'lucide-react'

async function uploadImages(file: File, shareURLs: ShareURLResponse) {
    const headers = Object.fromEntries(
        Object.entries(shareURLs.headers).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
    ) as {[key: string]: string}

    const response = await fetch(`${shareURLs.url}`, {
        method: 'PUT',
        headers,
        body: file
    })

    return response
}

export default function UploadAlbumImages({ albumId }: { albumId: number }) {
    const [files, setFiles] = useState<File[]>([])
    const [inputKey, setInputKey] = useState(0)
    const [isUploading, setIsUploading] = useState(false)

    return (
        <div className='flex flex-row items-center gap-4 w-md'>
            <Input
                key={inputKey}
                name='images'
                label='Images'
                type='file'
                multiple
                files={files}
                setFiles={(newFiles) => setFiles(newFiles || [])}
            />
            <button
                type='button'
                disabled={isUploading}
                className={`
                    flex flex-row gap-2 select-none cursor-pointer bg-login/90 
                    hover:bg-login/80 rounded-md text-nowrap items-center
                    disabled:cursor-not-allowed disabled:opacity-50
                `}
                onClick={async () => {
                    setIsUploading(true)

                    try {
                        if (files.length === 0) {
                            toast.error('No files selected for upload')
                            return
                        }

                        const fileInfos = files.map(f => ({filename: f.name, type: f.type}))
                        const shareUrls = await getShareURLs(albumId, fileInfos)
                        if (typeof shareUrls === 'string') {
                            toast.error(shareUrls)
                            return
                        }

                        const uploadPromises = files.map((file, i) => uploadImages(file, shareUrls[i]))
                        const results = await Promise.allSettled(uploadPromises)
                        const failedUploads = results.filter(result => result.status === 'rejected').map((_result, i) => files[i].name)
                        if (failedUploads.length > 0) {
                            toast.error(`Failed to upload: ${failedUploads.join(', ')}`)
                            return
                        }

                        compressAlbums()
                        toast.success('Images uploaded successfully')
                        setFiles([])
                        setInputKey(prev => prev + 1)
                        window.location.reload()
                    } finally {
                        setIsUploading(false)
                    }
                }}
            >
                {isUploading ? <Loader className='animate-spin size-10 p-2' /> : <Upload className='size-10 p-2' />}
            </button>
        </div>
    )
}