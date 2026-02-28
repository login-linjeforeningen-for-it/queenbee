import { useEffect, RefObject } from 'react'

/**
 * Hook that handles clicking outside of a referenced element
 * @param ref Reference to the element to detect outside clicks
 * @param callback Function to call when clicking outside
 */
export default function useClickOutside<T extends HTMLElement>(
    ref: RefObject<T>,
    callback: () => void
) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [ref, callback])
}
