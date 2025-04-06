'use client'
import Modal from '@components/modal/modal'
import TextInput from '@components/userInput/textInput'
import TextArea from '@components/userInput/textArea'
import { useState } from 'react'
import Filter from '@components/userInput/filter'
import Button from '@components/userInput/button'
import RuleModal from './ruleModal'

export default function page() {
    const [modal, setModal] = useState(false)
    const [filterText, setFilterText] = useState('')
    return (
        <div className='h-[var(--h-pageInfo)]'>
            <RuleModal modal={modal} setModal={setModal} />
            <h1 className="font-semibold text-lg">Organizations</h1>
            <div className='flex justify-between pb-4'>
                <Filter text={filterText} setText={setFilterText} />
                <Button text="New rule" icon='+' handleClick={() => setModal(true)} />
            </div>
            <form>
                <TextArea width={"50%"} height={"50%"} placeholder="hello" required={true} />
                <TextInput width={"50%"} placeholder="hello" required={true} />
                <input type="submit"/>
            </form>
        </div>
    )
}
