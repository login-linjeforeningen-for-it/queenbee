import postTag from '@utils/fetch/status/postTag'
import { X } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import { Button, Input, Modal } from 'uibee/components'

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

    return (
        <Modal isOpen={display} onClose={() => setAddingTag(false)} title='New Tag'>
            <form
                onSubmit={handleSubmit}
                className='grid gap-4'
            >
                <div className='grid gap-1'>
                    <Input
                        name='name'
                        label='Name'
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Tag name'
                        required
                    />
                </div>

                <div className='grid gap-1'>
                    <Input
                        name='color'
                        label='Color'
                        type='color'
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />
                    <span className='text-sm text-white/50'>Selected color: {color}</span>
                    {error && <span className='text-sm text-red-500'>{error}</span>}
                </div>

                <div className='flex justify-end gap-2 pt-2'>
                    <Button
                        text='Cancel'
                        variant='secondary'
                        icon={<X className='w-5' />}
                        onClick={() => setAddingTag(false)}
                    />
                    <Button type='submit' text='Create' icon='+' />
                </div>
            </form>
        </Modal>
    )
}
