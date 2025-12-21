import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'

export default function TrashShift() {
    const [shift, setShift] = useState(false)

    useEffect(() => {
        function down(e: KeyboardEvent) {
            setShift(e.shiftKey)
        }

        function up(e: KeyboardEvent) {
            setShift(e.shiftKey)
        }

        window.addEventListener('keydown', down)
        window.addEventListener('keyup', up)

        return () => {
            window.removeEventListener('keydown', down)
            window.removeEventListener('keyup', up)
        }
    }, [])

    return shift
        ? <Trash2 className='w-6 h-6 hover:stroke-red-500 cursor-pointer' />
        : <h1 className='text-white/30'>Press shift to delete</h1>
}
