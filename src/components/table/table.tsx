'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type TableProps = {
    list: object[]
    headers?: string[]
}

type HeaderProps = {
    keys: string[]
    headers : string[]
}

type BodyProps = {
    list: object[]
    headers: string[]
}

export default function Table({list, headers}: TableProps) {
    const keys = Object.keys(list[0])
    headers = headers || keys
    return (
        <div className='relative h-fit w-full max-h-[calc(((100vh-var(--h-navbar))-var(--h-pageInfo))-2rem)] overflow-scroll'>
            <table className='relative h-full border-collapse rounded-lg'>
                <Header keys={keys} headers={headers} />
                <Body list={list} headers={headers} />
            </table>
        </div>
    )
}

function Header({keys, headers}: HeaderProps) {
    const [column, setColumn] = useState(keys[0])
    const [order, setOrder] = useState<'asc'|'desc'>('asc')

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('order', order)
        params.set('column', column)
        router.push(`${pathname}?${params.toString()}`)
    }, [order, column, pathname, router, searchParams])

    function handleChange(key: string) {
        setColumn(key)
        setOrder(prev => (key === column && prev === 'asc' ? 'desc' : 'asc'))
    }

    return (
        <thead className='bg-extralight h-[2rem]'>
            <tr>
                {keys.map((key) => {
                    const value = key.length < 3 ? key.toUpperCase() : `${key[0].toUpperCase()}${key.slice(1).replaceAll('_', ' ')}`
                    if (!headers.includes(key)) {
                        return null
                    }

                    return (
                        <th key={key} className='whitespace-nowrap text-left px-2'>
                            <button
                                className='w-full h-full p-[0.5rem] flex flex-row items-center justify-between group'
                                onClick={() => handleChange(key)}
                            >
                                <h1>{value}</h1>
                                {column === key ? (
                                    order === 'asc' ? (
                                        <ChevronUp className='h-[1.5rem]' />
                                    ) : (
                                        <ChevronDown className='h-[1.5rem]' />
                                    )
                                ) : <ChevronUp className='h-[1.5rem] stroke-almostbright opacity-0 group-hover:opacity-100' />
                                }
                            </button>
                        </th>
                    )
                })}
                <th/>
            </tr>
        </thead>
    )
}



function Body({list, headers}: BodyProps) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)
    const pathname = usePathname()
    const router = useRouter()

    return list.map((_, index) => {
        const entries = Object.entries(list[index])
        const id = String(entries[0][1])
        
        return (
            <tbody key={index} className='bg-extralight h-[2rem]'>
                <tr className='border-y-1 border-dark'>
                    
                    {entries.map(([key, value]) => {
                        if (!headers.includes(key)) return null
                        return (
                            <td 
                                key={key} 
                                className='p-[0.5rem]'
                            >
                                <div className='relative group'>
                                    <h1 className='overflow-hidden text-ellipsis whitespace-nowrap max-w-[10rem]'>
                                        {String(value)}
                                    </h1>
                                </div>
                            </td>
                        )
                    })}
                    <td className='p-[0.5rem]'>
                        <button
                            type='button'
                            className={`px-3 py-1.5 rounded hover:bg-superlight ${openMenuId === id ? 'bg-superlight' : ''}`}
                            onClick={() => setOpenMenuId(openMenuId === id ? null : id)}
                        >
                            <span className={`text-xl leading-none select-none ${openMenuId === id ? 'text-white/50' : ''}`}>⋮</span>
                        </button>
                        {openMenuId === id && (
                            <div className='absolute right-0 mt-1 w-28 origin-top-right rounded-md bg-extralight border border-[color:var(--color-dark)] shadow-lg z-20'>
                                <div className='py-1'>
                                    <button
                                        className='w-full text-left px-3 py-1.5 text-sm hover:bg-superlight'
                                        onClick={() => { setOpenMenuId(null); router.push(`${pathname}/update/${id}`) }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className='w-full text-left px-3 py-1.5 text-sm hover:bg-superlight'
                                        onClick={() => { setOpenMenuId(null); router.push(`${pathname}/create/${id}`) }}
                                    >
                                        Duplicate
                                    </button>
                                    <button
                                        className='w-full text-left px-3 py-1.5 text-sm text-[color:var(--color-delete)] hover:bg-superlight'
                                        onClick={() => { setOpenMenuId(null); console.log('Delete', id) }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </td>
                </tr>
            </tbody>
        )})
}