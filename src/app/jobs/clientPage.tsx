'use client'
import List from "@components/list/list"
import Button from "@components/userInput/button"
import Filter from "@components/userInput/filter"
import { useState } from "react"

type ClientPageProps = {
    list: any[]
    visible: string[]
}

export default function ClientPage({list, visible}: ClientPageProps) {
    const [filterText, setFilterText] = useState('')

    function handleClick() {
        // new event modal
    }

    return (
        <div className='h-[var(--h-pageInfo)] max-w-[calc(100vw-var(--w-sidebar)-2rem)]'>
            <h1 className="font-semibold text-lg">Jobs</h1>
            <div className='flex justify-between pb-4'>
                <Filter text='' setText={() => {}} />
                <Button text='New location' icon='+' handleClick={() => {}} />
            </div>
            <List sticky={['id']} list={list} visible={visible}/>
        </div>
    )
}
