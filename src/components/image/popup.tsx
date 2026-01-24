'use client'

import { X } from 'lucide-react'
import { Button, Input, Range } from 'uibee/components'
import { useState, useRef, useEffect, MouseEvent, ChangeEvent } from 'react'


type UploadPopupProps = {
    file: File
    handleFileAction: (file: File) => void
    onCloseAction: () => void
    showTag?: boolean
}

export default function UploadPopup({ file, handleFileAction, onCloseAction, showTag }: UploadPopupProps) {
    const lastDotIndex = file.name.lastIndexOf('.')
    const hasExtension = lastDotIndex !== -1
    const extension = hasExtension ? file.name.substring(lastDotIndex) : ''
    const baseName = hasExtension ? file.name.substring(0, lastDotIndex) : file.name

    const [imageSrc, setImageSrc] = useState<string>('')
    const [fileName, setFileName] = useState<string>(baseName)
    const [scale, setScale] = useState<number>(1)
    const [minScale, setMinScale] = useState<number>(1)
    const [position, setPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)

    const imgRef = useRef<HTMLImageElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const dragStartRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 })
    const posStartRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 })

    useEffect(() => {
        const url = URL.createObjectURL(file)
        setImageSrc(url)
        return () => URL.revokeObjectURL(url)
    }, [file])

    function clampPosition(x: number, y: number, s: number) {
        if (!imgRef.current || !containerRef.current) return { x, y }

        const imgW = imgRef.current.naturalWidth * s
        const imgH = imgRef.current.naturalHeight * s
        const container = containerRef.current.getBoundingClientRect()

        const minX = Math.min(0, container.width - imgW)
        const maxX = 0
        const minY = Math.min(0, container.height - imgH)
        const maxY = 0

        return {
            x: Math.min(maxX, Math.max(minX, x)),
            y: Math.min(maxY, Math.max(minY, y))
        }
    }

    function handleImageLoad() {
        if (!imgRef.current || !containerRef.current) return

        const container = containerRef.current.getBoundingClientRect()
        const naturalWidth = imgRef.current.naturalWidth
        const naturalHeight = imgRef.current.naturalHeight

        const scaleX = container.width / naturalWidth
        const scaleY = container.height / naturalHeight
        const initialScale = Math.max(scaleX, scaleY)

        setMinScale(initialScale)
        setScale(initialScale)

        const imgW = naturalWidth * initialScale
        const imgH = naturalHeight * initialScale
        const initialX = (container.width - imgW) / 2
        const initialY = (container.height - imgH) / 2

        setPosition({ x: initialX, y: initialY })
    }

    function handleMouseDown(e: MouseEvent) {
        e.preventDefault()
        setIsDragging(true)
        dragStartRef.current = { x: e.clientX, y: e.clientY }
        posStartRef.current = { ...position }
    }

    function handleMouseMove(e: MouseEvent) {
        if (!isDragging) return
        e.preventDefault()
        const dx = e.clientX - dragStartRef.current.x
        const dy = e.clientY - dragStartRef.current.y

        const newX = posStartRef.current.x + dx
        const newY = posStartRef.current.y + dy

        setPosition(clampPosition(newX, newY, scale))
    }

    function handleMouseUp() {
        setIsDragging(false)
    }

    function handleZoom(e: ChangeEvent<HTMLInputElement>) {
        const newScale = Number(e.target.value)
        setScale(newScale)
        setPosition(prev => clampPosition(prev.x, prev.y, newScale))
    }

    function handleUpload() {
        if (!imgRef.current || !containerRef.current) return

        const container = containerRef.current.getBoundingClientRect()
        const sourceW = container.width / scale
        const sourceH = container.height / scale
        const sourceX = -position.x / scale
        const sourceY = -position.y / scale

        const canvas = document.createElement('canvas')
        canvas.width = sourceW
        canvas.height = sourceH

        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.drawImage(
                imgRef.current,
                sourceX, sourceY, sourceW, sourceH,
                0, 0, canvas.width, canvas.height
            )

            canvas.toBlob((blob) => {
                if (blob) {
                    const fullFileName = fileName + extension
                    const newFile = new File([blob], fullFileName, {
                        type: file.type,
                        lastModified: Date.now()
                    })
                    handleFileAction(newFile)
                    onCloseAction()
                }
            }, file.type)
        }
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4'>
            <div className='bg-login-800 rounded-xl border border-login-500/40
                relative shadow-2xl w-full max-w-lg flex flex-col overflow-hidden'
            >
                <div className='absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-login via-login to-login/80 rounded-t-xl' />

                <div className='flex items-center justify-between px-6 pt-6 pb-2'>
                    <h1 className='text-xl font-bold'>Upload Preview</h1>
                    <button
                        onClick={onCloseAction}
                        className='transition-colors rounded-lg hover:bg-login-50/5 p-2 select-none text-login-400 hover:text-white'
                        aria-label='Close'
                    >
                        <X className='w-5 h-5' />
                    </button>
                </div>

                <div className='p-6 space-y-6'>
                    <div className='flex justify-center bg-login-900/20 py-6 rounded-lg border border-login-500/20 border-dashed'>
                        <div
                            className='relative w-83 aspect-5/2 rounded-md overflow-hidden mx-auto cursor-move touch-none'
                            ref={containerRef}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            {imageSrc && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    ref={imgRef}
                                    src={imageSrc}
                                    alt='Preview'
                                    className='max-w-none origin-top-left pointer-events-none select-none'
                                    style={{
                                        transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
                                        width: 'auto',
                                        height: 'auto'
                                    }}
                                    onLoad={handleImageLoad}
                                    draggable={false}
                                />
                            )}
                            {showTag &&
                                <div className='absolute top-2 left-2 flex w-fit h-fit justify-center rounded
                                    min-w-14 min-h-14 py-1 px-2 backdrop-blur-sm bg-black/50 pointer-events-none'>
                                    <div className='w-fit'>
                                        <div className='text-center w-max mx-auto text-white text-xl leading-7'>14</div>
                                        <div className='text-center text-white text-base leading-5 -translate-y-0.5'>Apr</div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>

                    <div className='space-y-4'>
                        <Range
                            name='imageZoom'
                            label='Zoom'
                            min={minScale}
                            max={minScale * 3}
                            step={0.001}
                            value={scale}
                            onChange={handleZoom}
                            showValue={false}
                        />
                        <Input
                            name='fileName'
                            label='File name'
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            placeholder='Enter file name'
                        />
                    </div>
                </div>

                <div className='flex justify-end gap-3 px-6 py-4 bg-login-900/20 border-t border-login-500/40'>
                    <Button
                        icon={<X className='w-4 h-4' />}
                        color='secondary'
                        text='Cancel'
                        onClick={onCloseAction}
                    />
                    <Button
                        icon='+'
                        text='Upload'
                        onClick={handleUpload}
                    />
                </div>
            </div>
        </div>
    )
}
