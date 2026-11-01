'use client'

import { Button, FileInput } from 'uibee/components'
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
        <div className='flex flex-col gap-3 sm:flex-row sm:items-end'>
            <FileInput
                key={inputKey}
                name='images'
                label='Add images'
                accept='image/*'
                multiple
                onChange={setFiles}
                className='flex-1'
            />
            <Button
                type='button'
                disabled={isUploading || files.length === 0}
                text={isUploading ? 'Uploading…' : `Upload${files.length ? ` ${files.length}` : ''}`}
                icon={isUploading ? <Loader className='animate-spin' /> : <Upload />}
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
                        const failedUploads = files
                            .filter((_, i) => { const r = results[i]; return r.status === 'rejected' || !r.value.ok })
                            .map(file => file.name)
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
            />
        </div>
    )
}
