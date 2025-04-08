'use client'

import ArrowDown from '@components/svg/arrowDown'
import ArrowUp from '@components/svg/arrowUp'
import Link from 'next/link'
import { useState } from 'react'

type ListProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    list: any[]
    sticky: string[]
    visible: string[]
}

type HeaderProps = {
    keys: string[]
    sticky: string[]
    visible: string[]
}

type BodyProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    list: any[]
    sticky: string[]
    visible: string[]
}

export default function List({list, sticky, visible}: ListProps) {
    const keys = Object.keys(list[0])

    return (
        <div className='relative h-fit w-full max-h-[calc(((100vh-var(--h-navbar))-var(--h-pageInfo))-2rem)] noscroll overflow-scroll'>
            <table className='relative h-full w-full border-separate border-spacing-[1px] rounded-lg'>
                <Header keys={keys} sticky={sticky} visible={visible} />
                <Body list={list} sticky={sticky} visible={visible} />
            </table>
        </div>

    )
}

function Header({keys, sticky, visible}: HeaderProps) {
    const [column, setColumn] = useState(keys[0])
    const [sort, setSort] = useState<'asc'|'desc'>('asc')

    function handleChange(key:string){
        if(key === column) {
            setSort(sort === 'asc' ? 'desc' : 'asc')
        } else {
            setColumn(key)
            setSort('asc')
        }
        
        
    }

    return (
        <thead className='bg-extralight h-[2rem]'>
            <tr>
                {keys.map((key) => {
                    const value = key.length < 3 ? key.toUpperCase() : `${key[0].toUpperCase()}${key.slice(1).replaceAll('_', ' ')}`
                    if (!visible.includes(key)) {
                        return null
                    }

                    return (
                        <th key={key} className={`whitespace-nowrap text-left ${sticky.includes(key) ? 'shadow-[1px_0_0_0_var(--color-dark)] font-bold sticky left-0 z-10 bg-extralight' : 'font-normal'}`}>
                            <Link
                                href=''
                                className='w-full h-full p-[0.5rem] flex flex-row items-center justify-between group'
                                onClick={() => handleChange(key)}
                            >
                                <h1>{value}</h1>
                                {column === key ? (
                                    sort === 'asc' ? (
                                        <ArrowUp className='h-[1.5rem] fill-bright' />
                                    ) : (
                                        <ArrowDown className='h-[1.5rem] fill-bright' />
                                    )
                                ) : <ArrowUp className='h-[1.5rem] fill-almostbright opacity-0 group-hover:opacity-100' />
                                }
                                
                            </Link>
                        </th>
                    )
                })}
            </tr>
        </thead>
    )
}

function Body({list, sticky, visible}: BodyProps) {
    return list.map((_, index) => {
        const entries = Object.entries(list[index])
        const maxChars = 18
        const end = index >= list.length - 3
        return (
            <tbody key={index} className='bg-extralight h-[2rem]'>
                <tr>
                    {entries.map(([key, value]) => {
                        if (!visible.includes(key)) return null
                        return (
                            <td 
                                key={key} 
                                className={`p-[0.5rem] ${sticky.includes(key) ? 'shadow-[1px_0_0_0_var(--color-dark)] font-bold sticky left-0 z-10 bg-extralight' : 'font-normal'}`}
                            >
                                <div className='relative group'>
                                    <h1 className='overflow-hidden text-ellipsis whitespace-nowrap max-w-[10rem]'>
                                        {String(value)}
                                    </h1>
                                    {String(value).length > maxChars && (
                                        <div className={`absolute left-0 z-999 hidden group-hover:block bg-normal p-2 rounded max-w-xs break-words whitespace-normal border border-foreground ${(end) ? 'bottom-full' : ''}`}>
                                            {String(value)}
                                        </div>
                                    )}
                                </div>
                            </td>
                        )
                    })}
                </tr>
            </tbody>
        )})
}
