import postTag from '@utils/fetch/status/postTag'
import { X } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import { Button } from 'uibee/components'

type NewTagProps = {
    display: boolean
    setAddingTag: Dispatch<SetStateAction<boolean>>
    setRefresh: Dispatch<SetStateAction<boolean>>
}

export default function NewTag({ display, setAddingTag, setRefresh }: NewTagProps) {
    const [name, setName] = useState('')
    const [color, setColor] = useState('#fd8738')
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        e.stopPropagation()

        if (!name) {
            return
        }

        const response = await postTag(name, color)
        if ('message' in response) {
            setName('')
            setColor('#fd8738')
            setAddingTag(false)
            setRefresh(true)
        } else {
            setError('Unable to reach server. Please try again later.')
        }
    }

    if (!display) {
        return
    }

    return (
        <div
            onClick={(e) => { e.stopPropagation(); setAddingTag(false) }}
            className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
        >
            <form
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
                className='bg-login-50/5 backdrop-blur-md rounded-xl p-6 w-full max-w-md grid gap-4'
            >
                <h1 className='text-2xl font-semibold text-center'>New Tag</h1>

                <div className='grid gap-1'>
                    <label className='font-medium'>Name</label>
                    <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Tag name'
                        className='px-3 py-2 rounded-md bg-login-50/5 outline outline-white/20 focus:outline-blue-500'
                        required
                    />
                </div>

                <div className='grid gap-1'>
                    <label className='font-medium'>Color</label>
                    <input
                        type='color'
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className='w-full h-10 rounded-md cursor-pointer border-none p-0'
                    />
                    <span className='text-sm text-white/50'>Selected color: {color}</span>
                    {error && <span className='text-sm text-red-500'>{error}</span>}
                </div>

                <div className='flex justify-end gap-2 pt-2'>
                    <Button
                        text='Cancel'
                        color='secondary'
                        icon={<X className='w-5' />}
                        onClick={() => setAddingTag(false)}
                    />
                    <Button type='submit' text='Create' icon='+' />
                </div>
            </form>
        </div>
    )
}
