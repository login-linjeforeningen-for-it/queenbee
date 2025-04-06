'use client'
import FilterList from "@components/filterList/filterList"
import List from "@components/list/list"
import Button from "@components/userInput/button"
import Filter from "@components/userInput/filter"
import { useEffect, useState } from "react"

type ClientPageProps = {
    list: any[]
    visible: string[]
}

export default function ClientPage({list, visible}: ClientPageProps) {
    const [filterText, setFilterText] = useState('')
    const [filteredList, setFilteredList] = useState<any[]>(list)

    useEffect(() => {
        if (filterText !== '') setFilteredList(FilterList({ list, filterText }))
        else setFilteredList(list)
    }, [list,filterText])

    return (
        <div className={`max-w-[calc(100vw-var(--w-sidebar)-2rem)] h-[var(--h-pageInfo)] ${filteredList.length ? '' : 'h-full'}`}>
            <h1 className="font-semibold text-lg">Organizations</h1>
            <div className='flex justify-between pb-4'>
                <Filter text={filterText} setText={setFilterText} />
                <Button text="New organization" icon='+' path='organizations/0' />
            </div>
            {filteredList.length > 0 && <List sticky={['shortname']} list={filteredList} visible={visible}/> }
            {filteredList.length <= 0 && 
            <div className="grid place-items-center self-center h-full">
                <h1>Did not find any organizations.</h1>
            </div>
            }
        </div>
    )
}
