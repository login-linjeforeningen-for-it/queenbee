'use client'
import TextInput from '@components/userInput/textInput'
import TextArea from '@components/userInput/textArea'
import { useState } from 'react'
import Filter from '@components/userInput/filter'
import Button from '@components/userInput/button'

export default function page() {
    const [filterText, setFilterText] = useState('')
    return (
        <div className='h-[var(--h-pageInfo)]'>
            <h1 className="font-semibold text-lg">Rules</h1>
            <div className='flex justify-between pb-4'>
                <Filter text={filterText} setText={setFilterText} />
                <Button text="New rule" icon='+' path='rules/0' />
            </div>
            <form>
                <TextArea width={"50%"} height={"50%"} placeholder="hello" required={true} />
                <TextInput width={"50%"} placeholder="hello" required={true} />
                <input type="submit"/>
            </form>
        </div>
    )
}
