'use client'

import Input from '@components/inputs/input'
import { toast } from 'sonner'
import config from '@config'
import { useState } from 'react'
import { Upload } from 'lucide-react'
import { getCookie } from '@utils/cookies'

const api = process.env.NEXT_PUBLIC_API_URL

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

    if (!response || !response.ok) {
        toast.error('Failed to upload images')
    } else {
        toast.success('Images uploaded successfully')
    }

    return response
}

export default function UploadAlbumImages({ albumId }: { albumId: number }) {
    const [files, setFiles] = useState<File[]>([])
    const [inputKey, setInputKey] = useState(0)

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
                className={`flex flex-row gap-2 cursor-pointer bg-login/90 hover:bg-login/80 
                    rounded-md text-nowrap items-center
                `}
                onClick={async () => {
                    if (files.length === 0) {
                        toast.error('No files selected for upload')
                        return
                    }
                    const response = await uploadImages(albumId, files)
                    if (response.ok) {
                        setFiles([])
                        setInputKey(prev => prev + 1)
                        window.location.reload()
                    }
                }}
            >
                <Upload className='size-10 p-2'/>
            </button>
        </div>
    )
}