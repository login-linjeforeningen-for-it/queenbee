'use client'
import Modal from '@components/modal/modal'
import TextInput from '@components/userInput/textInput'
import TextArea from '@components/userInput/textArea'
import { useState } from 'react'
import Filter from '@components/userInput/filter'
import Button from '@components/userInput/button'

export default function page() {
    const [showModal, setShowModal] = useState(false)
    const [filterText, setFilterText] = useState('')

    function handleClick() {
        // new event modal
    }

    return (
        <div className='h-[var(--h-pageInfo)]'>
            {showModal && (
                <Modal close={() => setShowModal(false)}>
                    <div className='flex flex-col gap-4'>
                        <h1 className='text-2xl font-bold'>Create new rule</h1>
                        <input type='text' placeholder='Rule name' className='border border-gray-300 rounded p-2' />
                        <textarea placeholder='Rule description' className='border border-gray-300 rounded p-2' />
                        <button onClick={()=>{setShowModal(false)}} className='bg-blue-500 text-white rounded p-2'>Create</button>
                    </div>
                </Modal>
            )}
            <h1 className="font-semibold text-lg">Organizations</h1>
            <div className='flex justify-between pb-4'>
                <Filter text={filterText} setText={setFilterText} />
                <Button text="New rule" icon='+' handleClick={handleClick} />
            </div>
            <form>
                <TextArea width={"50%"} height={"50%"} placeholder="hello" required={true} />
                <TextInput width={"50%"} placeholder="hello" required={true} />
                <input type="submit"/>
            </form>
        </div>
    )
}
