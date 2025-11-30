import React, { useState } from 'react'
import UploadPopup from './uploadPopup'

type UploadProps = {
    handleFile: (file: File) => void
    showSwitch?: boolean
}

export default function Upload({ handleFile, showSwitch }: UploadProps) {
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
            <label className='bg-login text-login-700 px-5 py-2 rounded-md cursor-pointer hover:bg-login/90 w-fit'>
                Upload Image
                <input
                    ref={inputRef}
                    type='file'
                    accept='image/*'
                    onChange={handleFileChange}
                    className='hidden'
                />
            </label>
            {open && file && (
                <UploadPopup onClose={handleClose} file={file} handleFile={handleFile} showSwitch={showSwitch} />
            )}
        </>
    )
}
