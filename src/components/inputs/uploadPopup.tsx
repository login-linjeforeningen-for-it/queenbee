'use client'

import Cropper, { Area } from 'react-easy-crop'
import cropImage from '@/utils/image/cropImage'
import { X } from 'lucide-react'
import NextImage from 'next/image'
import { useCallback, useEffect, useState } from 'react'
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
    const [showTag, setShowTag] = useState(showSwitch)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [needsCrop, setNeedsCrop] = useState(false)

    useEffect(() => {
        const img = new Image()
        img.onload = () => {
            const ratio = img.width / img.height
            if (ratio !== 2.5) {
                setNeedsCrop(true)
                setUploadDisabled(false)
            }
        }
        img.src = image
    }, [file])

    const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
        setCroppedAreaPixels(croppedPixels)
    }, [])

    async function handleClick() {
        if (needsCrop && croppedAreaPixels) {
            const blob = await cropImage(image, croppedAreaPixels)
            const croppedFile = new File([blob], file.name, { type: file.type })
            handleFile(croppedFile)
        } else {
            handleFile(file)
        }

        onClose()
    }

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

                <div className='relative w-full h-[300px] border border-login-600/30 rounded-md overflow-hidden'>
                    {needsCrop ? (
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            aspect={5 / 2}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    ) : (
                        <NextImage
                            src={image}
                            alt='Preview'
                            fill
                            className='object-cover'
                        />
                    )}

                    <div className='absolute top-2 left-2 flex w-fit h-fit justify-center rounded
                        min-w-14 min-h-14 py-1 px-2 backdrop-blur-sm bg-black/50'>
                        <div className='w-fit'>
                            <div className='text-center w-max mx-auto text-white text-xl leading-7'>14</div>
                            <div className='text-center text-white text-base leading-5 -translate-y-0.5'>Apr</div>
                        </div>
                    </div>
                </div>

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
                            onClick={handleClick}
                        >
                            Upload
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
