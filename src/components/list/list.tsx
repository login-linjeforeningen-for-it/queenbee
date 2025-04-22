'use client'

import ArrowDown from '@components/svg/arrowDown'
import ArrowUp from '@components/svg/arrowUp'
import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
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
                <th className={'whitespace-nowrap text-left shadow-[1px_0_0_0_var(--color-dark)] font-bold sticky left-0 z-10 bg-extralight px-2'}>
                    <h1>Select</h1>
                </th>
                {keys.map((key) => {
                    const value = key.length < 3 ? key.toUpperCase() : `${key[0].toUpperCase()}${key.slice(1).replaceAll('_', ' ')}`
                    if (!visible.includes(key)) {
                        return null
                    }

                    return (
                        <th key={key} className={`whitespace-nowrap text-left px-2 ${sticky.includes(key) ? 'shadow-[1px_0_0_0_var(--color-dark)] font-bold sticky left-[4rem] z-10 bg-extralight' : 'font-normal'}`}>
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
    const [selected, setSelected] = useState<string[]>([])
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    function handleCheck(e: React.MouseEvent<HTMLInputElement>) {
        const id = (e.target as HTMLInputElement).id
        const newSelected = selected.includes(id) ? selected.filter(item => item !== id) : [...selected, id] 
        setSelected(newSelected)
        const params = new URLSearchParams(searchParams.toString())
        params.set('selected', newSelected.join(','))
        router.push(`${pathname}?${params.toString()}`)
    }

    return list.map((_, index) => {
        const entries = Object.entries(list[index])
        const maxChars = 18
        const end = index >= list.length - 3
        return (
            <tbody key={index} className='bg-extralight h-[2rem]'>
                <tr>
                    <td className={'p-[0.5rem] shadow-[1px_0_0_0_var(--color-dark)] font-bold sticky left-0 z-10 bg-extralight'}
                    >
                        <div className='flex w-full justify-center'>
                            <label className='group w-fit cursor-pointer grid grid-cols-[fit]'>
                                <input
                                    id={String(index)}
                                    type='checkbox'
                                    className='peer absolute cursor-pointer opacity-0 h-0 w-0'
                                    onClick={(e) => handleCheck(e)}
                                />
                                <span className='group-hover:bg-superlight peer-checked:bg-login peer-checked:border-login peer-checked:after:block relative inline-block align-middle transition-all duration-[0.1s] ease-[ease-in] w-[1.4rem] h-[1.4rem] border-[color:var(--color-checkbox-outline)] rounded-[0.1rem] border-[0.13rem] border-solid after:content-[""] after:absolute after:hidden after:w-[0.4rem] after:h-[0.8rem] after:-translate-x-2/4 after:-translate-y-2/4 after:rotate-45 after:border-[solid] after:border-[0_0.18rem_0.18rem_0] after:left-2/4 after:top-[45%]' />
                            </label>
                        </div>
                    </td>
                    {entries.map(([key, value]) => {
                        if (!visible.includes(key)) return null
                        return (
                            <td 
                                key={key} 
                                className={`p-[0.5rem] ${sticky.includes(key) ? 'shadow-[1px_0_0_0_var(--color-dark)] font-bold sticky left-[4rem] z-10 bg-extralight' : 'font-normal'}`}
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