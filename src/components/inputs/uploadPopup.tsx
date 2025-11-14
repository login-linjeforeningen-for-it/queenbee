'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Switch from './switch'


type UploadPopupProps = {
    file: File
    handleFile: (file: File) => void
    onClose: () => void
    showSwitch?: boolean
}

export default function UploadPopup({ file, handleFile, onClose, showSwitch }: UploadPopupProps) {
    const image = URL.createObjectURL(file)
    const [uploadDisabled, setUploadDisabled] = useState(true)
    const [error, setError] = useState('')
    const [showTag, setShowTag] = useState(showSwitch)

    useEffect(() => {
        if (file.type.startsWith('image/')) {
            if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
                setError('File must be JPG, PNG, or GIF')
                setUploadDisabled(true)
                return
            }
            const img = new window.Image()
            img.onload = () => {
                const ratio = img.width / img.height
                if (ratio !== 2.5) {
                    setError('Image aspect ratio must be 5:2')
                } else if (file.size > 1 * 1024 * 1024) {
                    setError('Image size must be less than 1MB')
                } else {
                    setError('')
                }
                setUploadDisabled(ratio !== 2.5 || file.size > 1 * 1024 * 1024)
            }
            img.src = image
        } else {
            setError('File must be an image')
            setUploadDisabled(true)
        }
    }, [file, image])

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md'>
            <div className='bg-login-800 rounded-xl px-8 py-6 border border-login-500/40
                relative shadow-2xl max-w-2xl w-full mx-4 overflow-hidden'
            >
                <div className='absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-login via-login to-login/80 rounded-t-2xl' />

                <div className='flex items-center justify-between mb-6 pt-2'>
                    <h1 className='text-2xl font-bold'>Upload Preview</h1>
                    <button
                        onClick={onClose}
                        className='transition-colors rounded-lg hover:bg-login-600 p-2'
                        aria-label='Close'
                    >
                        <X className='w-5 h-5' />
                    </button>
                </div>

                <div className='relative h-fit aspect-5/2 flex flex-col items-center justify-center'>
                    <div className='relative'>
                        <Image
                            src={image}
                            alt='Preview'
                            width={332}
                            height={133}
                            className='border border-login-600/30 aspect-5/2'
                        />
                        {showTag && (
                            <div className='absolute top-2 left-2 flex w-fit h-fit justify-center rounded
                                min-w-14 min-h-14 py-1 px-2 backdrop-blur-sm bg-black/50'>
                                <div className='w-fit'>
                                    <div className='text-center w-max mx-auto text-white text-xl leading-7'>14</div>
                                    <div className='text-center text-white text-base leading-5 -translate-y-0.5'>Apr</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <p className='text-red-400 text-center'>
                    {error}
                </p>

                <div className='flex justify-between pt-4 mt-6 border-t border-login-500/80'>
                    <div className='mb-4 w-fit'>
                        {showSwitch && (
                            <Switch
                                name='showTag'
                                label='Show Tag'
                                value={showTag}
                                setValue={setShowTag}
                                className='border-transparent bg-login-500/60'
                            />
                        )}
                    </div>
                    <div className='flex gap-4 h-fit'>
                        <button
                            onClick={onClose}
                            className='px-6 py-2 rounded-md bg-login-500/60 cursor-pointer'
                        >
                            Cancel
                        </button>
                        <button
                            className={`px-6 py-2 rounded-md bg-login 
                                ${uploadDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            disabled={uploadDisabled}
                            onClick={() => {
                                handleFile(file)
                                onClose()
                            }}
                        >
                            Upload
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
