import React, { useState } from 'react'
import UploadPopup from './popup'
import { UploadIcon } from 'lucide-react'

type UploadProps = {
    handleFile: (file: File) => void
    showTag?: boolean
}

export default function Upload({ handleFile, showTag }: UploadProps) {
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return
        setFile(selectedFile)
        setOpen(true)
    }

    function handleClose() {
        setOpen(false)
        setFile(null)
        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    return (
        <>
            <label className='bg-login/70 outline-login hover:bg-login/90 cursor-pointer px-4 rounded-md min-h-8 h-8 flex
                    justify-evenly items-center gap-2 select-none
                    focus:outline-none border-0 outline w-fit mb-4'>
                <input
                    ref={inputRef}
                    type='file'
                    accept='image/*'
                    onChange={handleFileChange}
                    className='hidden'
                />
                <UploadIcon className='size-4.5' />
                Upload Image
            </label>
            {open && file && (
                <UploadPopup onCloseAction={handleClose} file={file} handleFileAction={handleFile} showTag={showTag} />
            )}
        </>
    )
}
