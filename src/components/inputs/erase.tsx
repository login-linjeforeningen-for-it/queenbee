import { Eraser } from 'lucide-react'

export default function EraseButton({ setData }: { setData: (data: string) => void }) {
    return (
        <button
            type='button'
            onClick={() => setData('')}
            className='absolute right-1 cursor-pointer px-2 py-1 bg-normal hover:bg-light rounded-md'
        >
            <Eraser className='w-5' />
        </button>
    )
}
