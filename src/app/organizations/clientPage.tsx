'use client'
import Button from "@components/userInput/button"
import Filter from "@components/userInput/filter"
import { useState } from "react"

export default function ClientPage() {
    const [filterText, setFilterText] = useState('')

    function handleClick() {
        // new event modal
    }

    return (
        <div className='h-[var(--h-pageInfo)]'>
            <h1 className="font-semibold text-lg">Organizations</h1>
            <div className='flex justify-between pb-4'>
                <Filter text={filterText} setText={setFilterText} />
                <Button text="New organization" icon='+' handleClick={handleClick} />
            </div>
        </div>
    )
}
