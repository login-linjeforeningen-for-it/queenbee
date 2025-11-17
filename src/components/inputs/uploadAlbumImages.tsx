'use client'

import Input from '@components/inputs/input'
import { toast } from 'sonner'
import config from '@config'
import { useState } from 'react'
import { Upload, Loader } from 'lucide-react'
import { getCookie } from '@utils/cookies'

const api = process.env.NEXT_PUBLIC_API_URL

function chunkArray(array: File[], size: number): File[][] {
    const chunks = []
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size))
    }
    return chunks
}

async function uploadImages(id: number, files: File[]) {
    const formData = new FormData()
    files.forEach(file => {
        formData.append('images', file)
    })

    const response = await fetch(`${api}${config.workerbeeApi.albums.PATH}${id}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getCookie('access_token') || ''}`
        },
        body: formData
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
                className={`flex flex-row gap-2 cursor-pointer bg-login/90 hover:bg-login/80 
                    rounded-md text-nowrap items-center disabled:cursor-not-allowed disabled:opacity-50
                `}
                onClick={async () => {
                    setIsUploading(true)
                    try {
                        if (files.length === 0) {
                            toast.error('No files selected for upload')
                            return
                        }
                        const chunks = chunkArray(files, 4)
                        const uploadPromises = chunks.map(chunk => uploadImages(albumId, chunk))
                        const responses = await Promise.all(uploadPromises)
                        const allOk = responses.every(response => response.ok)
                        if (allOk) {
                            toast.success('Images uploaded successfully')
                            setFiles([])
                            setInputKey(prev => prev + 1)
                            window.location.reload()
                        } else {
                            toast.error('Failed to upload some images')
                        }
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