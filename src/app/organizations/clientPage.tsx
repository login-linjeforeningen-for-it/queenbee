'use client'
import Modal from "@components/modal/modal"
import Button from "@components/userInput/button"
import Filter from "@components/userInput/filter"
import { useState } from "react"

export default function ClientPage() {
    const [filterText, setFilterText] = useState('')
    const [modal, setModal] = useState(false)

    return (
        <div className='h-[var(--h-pageInfo)]'>
            <h1 className="font-semibold text-lg">Organizations</h1>
            <div className='flex justify-between pb-4'>
                <Filter text={filterText} setText={setFilterText} />
                <Button text="New organization" icon='+' handleClick={() => setModal(true)} />
            </div>
            <Modal display={modal} close={() => setModal(false)}>
                <h1>lager nytt event...</h1>
            </Modal>
        </div>
    )
}
