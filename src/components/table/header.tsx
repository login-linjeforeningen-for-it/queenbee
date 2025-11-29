import { ChevronDown, ChevronUp } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type HeaderProps = {
    keys: string[]
    headers: string[]
}

export default function Header({ keys, headers }: HeaderProps) {
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

    return (
        <thead className='h-8'>
            <tr>
                {keys.map((key) => {
                    const value =
                        key.length < 3
                            ? key.toUpperCase()
                            : `${key[0].toUpperCase()}${key
                                .slice(1)
                                .replaceAll('_', ' ')}`
                    if (!headers.includes(key)) {
                        return null
                    }

                    return (
                        <th key={key} className='whitespace-nowrap text-left'>
                            <button
                                className={
                                    'w-full h-full p-2 flex flex-row ' +
                                    'items-center justify-between group'
                                }
                                onClick={() => handleChange(key)}
                            >
                                <h1>{value}</h1>
                                {column === key ? (
                                    order === 'asc' ? (
                                        <ChevronUp className='h-6' />
                                    ) : (
                                        <ChevronDown className='h-6' />
                                    )
                                ) : (
                                    <ChevronUp
                                        className={
                                            'h-6 stroke-login-200 ' +
                                            'opacity-0 group-hover:opacity-100'
                                        }
                                    />
                                )}
                            </button>
                        </th>
                    )
                })}
                <th />
            </tr>
        </thead>
    )
}
