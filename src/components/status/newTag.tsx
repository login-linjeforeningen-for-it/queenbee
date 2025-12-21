import { postTag } from '@utils/api'
import { Dispatch, SetStateAction, useState } from 'react'

type NewTagProps = {
    display: boolean
    setAddingTag: Dispatch<SetStateAction<boolean>>
}

export default function NewTag({ display, setAddingTag }: NewTagProps) {
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
        if (!response.includes('failed')) {
            setName('')
            setColor('#fd8738')
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
                className='bg-white/10 backdrop-blur-md rounded-xl p-6 w-full max-w-md grid gap-4 text-white'
            >
                <h1 className='text-2xl font-semibold text-center'>New Tag</h1>

                <div className='grid gap-1'>
                    <label className='font-medium'>Name</label>
                    <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Tag name'
                        className='px-3 py-2 rounded-md bg-white/10 outline outline-white/20 focus:outline-blue-500'
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
                    <button
                        type='button'
                        onClick={() => setAddingTag(false)}
                        className='px-4 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer'
                    >
                        Cancel
                    </button>
                    <button
                        type='submit'
                        className={`
                            px-4 py-0.5 rounded-lg bg-login/80 hover:bg-login
                            hover:brightness-110 cursor-pointer
                        `}
                    >
                        Create
                    </button>
                </div>
            </form>
        </div>
    )
}
