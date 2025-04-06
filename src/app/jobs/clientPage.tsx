'use client'
import FilterList from "@components/filterList/filterList"
import List from "@components/list/list"
import Modal from "@components/modal/modal"
import Button from "@components/userInput/button"
import Filter from "@components/userInput/filter"
import { useEffect, useState } from "react"

type ClientPageProps = {
    list: any[]
    visible: string[]
}

export default function ClientPage({list, visible}: ClientPageProps) {
    const [filterText, setFilterText] = useState('')
    const [modal, setModal] = useState(false)
    const [filteredList, setFilteredList] = useState<any[]>(list)

    useEffect(() => {
        if (filterText !== '') setFilteredList(FilterList({ list, filterText }))
        else setFilteredList(list)
    }, [list,filterText])

    return (
        <div className={`h-[var(--h-pageInfo)] max-w-[calc(100vw-var(--w-sidebar)-2rem)] ${filteredList.length ? '' : 'h-full'}`}>
            <h1 className="font-semibold text-lg">Jobs</h1>
            <div className='flex justify-between pb-4'>
                <Filter text={filterText} setText={setFilterText} />
                <Button text='New location' icon='+' handleClick={() => setModal(true)} />
            </div>
            {filteredList.length > 0 && <List sticky={['id']} list={filteredList} visible={visible}/> }
            {filteredList.length <= 0 && 
            <div className="grid place-items-center self-center h-full">
                <h1>Did not find any jobs.</h1>
            </div>
            }
            <Modal display={modal} close={() => setModal(false)}>
                <h1>lager ny jobb...</h1>
            </Modal>
        </div>
    )
}
