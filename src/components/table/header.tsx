import { ChevronDown, ChevronUp } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type HeaderProps = {
    keys: string[]
    headers: string[]
    hideMenu?: boolean
}

export default function Header({ keys, headers, hideMenu }: HeaderProps) {
    const [column, setColumn] = useState(keys[0])
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (
            searchParams.get('order') !== order ||
            searchParams.get('column') !== column
        ) {
            params.set('order', order)
            params.set('column', column)
            params.set('page', '1')
            router.push(`${pathname}?${params.toString()}`)
        }
    }, [order, column, pathname, router, searchParams])

    function handleChange(key: string) {
        setColumn(key)
        setOrder((prev) => (key === column && prev === 'asc' ? 'desc' : 'asc'))
    }

    function formatLabel(key: string) {
        if (key.length < 3) {
            return key.toUpperCase()
        }

        const spaced = key
            .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
            .replaceAll('_', ' ')

        return `${spaced[0].toUpperCase()}${spaced.slice(1)}`
    }

    return (
        <thead className='bg-login-700 block w-full'>
            <tr className='flex w-full'>
                {keys.map((key) => {
                    if (!headers.includes(key)) {
                        return null
                    }
                    const value = formatLabel(key)

                    return (
                        <th
                            key={key}
                            className='flex-1 px-6 py-3 text-xs font-medium text-login-200 uppercase tracking-wider text-left'
                        >
                            <button
                                className='flex flex-row items-center gap-2 group uppercase'
                                onClick={() => handleChange(key)}
                            >
                                {value}
                                <span className='flex flex-col'>
                                    {column === key ? (
                                        order === 'asc' ? (
                                            <ChevronUp className='h-4 w-4' />
                                        ) : (
                                            <ChevronDown className='h-4 w-4' />
                                        )
                                    ) : (
                                        <ChevronUp
                                            className='h-4 w-4 stroke-login-200 opacity-0 group-hover:opacity-100'
                                        />
                                    )}
                                </span>
                            </button>
                        </th>
                    )
                })}
                {!hideMenu && <th className='shrink-0 w-16 px-6 py-3' />}
            </tr>
        </thead>
    )
}
