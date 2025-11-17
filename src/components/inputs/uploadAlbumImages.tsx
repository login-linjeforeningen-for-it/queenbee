'use client'

import Input from '@components/inputs/input'
import { toast } from 'sonner'
import config from '@config'
import { useState } from 'react'
import { Upload, Loader } from 'lucide-react'
import { getCookie } from '@utils/cookies'

const api = process.env.NEXT_PUBLIC_API_URL

type shareKeysResponse = {
    url: string,
    headers: {[key: string]: string | string[]},
    key: string
}

async function getShareKey(id: number, files: {filename: string, type: string}[]) {
    const response = await fetch(`${api}${config.workerbeeApi.albums.PATH}${id}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getCookie('access_token') || ''}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(files)
    })

    if (response.ok) {
        const data = await response.json()
        return data as shareKeysResponse[]
    } else {
        throw new Error('Failed to get share key')
    }
}

async function uploadImages(file: File, shareKey: shareKeysResponse) {
    const headers = Object.fromEntries(
        Object.entries(shareKey.headers).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
    ) as {[key: string]: string}

    const response = await fetch(`${shareKey.url}`, {
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
                        const fileInfos = files.map(f => ({filename: f.name, type: f.type}))
                        const shareKeys = await getShareKey(albumId, fileInfos)
                        const uploadPromises = files.map((file, i) => uploadImages(file, shareKeys[i]))
                        const results = await Promise.allSettled(uploadPromises)
                        const failedUploads = results.filter(result => result.status === 'rejected').map((_result, i) => files[i].name)
                        if (failedUploads.length > 0) {
                            toast.error(`Failed to upload: ${failedUploads.join(', ')}`)
                            return
                        }
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