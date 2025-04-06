'use client'
import Button from "@components/userInput/button"
import Filter from "@components/userInput/filter"
import { useState } from "react"

export default function ClientPage() {
    const [filterText, setFilterText] = useState('')

    return (
        <div className='max-w-[calc(100vw-var(--w-sidebar)-2rem)] h-[var(--h-pageInfo)]'>
            <h1 className="font-semibold text-lg">Organizations</h1>
            <div className='flex justify-between pb-4'>
                <Filter text={filterText} setText={setFilterText} />
                <Button text="New organization" icon='+' path='organizations/0' />
            </div>
        </div>
    )
}
