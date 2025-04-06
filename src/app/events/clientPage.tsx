'use client'
import List from "@components/list/list"
import Modal from "@components/modal/modal"
import Button from "@components/userInput/button"
import Filter from "@components/userInput/filter"
import { useState } from "react"

type ClientPageProps = {
    list: any[]
    visible: string[]
}

export default function ClientPage({list, visible}: ClientPageProps) {
    const [filterText, setFilterText] = useState('')
    const [modal, displayModal] = useState<boolean>(false)

    return (
        <div className='h-[var(--h-pageInfo)] max-w-[calc(100vw-var(--w-sidebar)-2rem)]'>
            <h1 className="font-semibold text-lg">Events</h1>
            <div className='flex justify-between pb-4'>
                <Filter text={filterText} setText={setFilterText} />
                <Button text='New event' icon='+' handleClick={() => displayModal(true)}/>
            </div>
            <List sticky={['id']} list={list} visible={visible}/>
            <Modal display={modal} close={() => displayModal(false)}>
                <h1>lager nytt event...</h1>
            </Modal>
        </div>
    )
}
