import Modal from "@components/modal/modal"
import { Dispatch, SetStateAction } from "react"

type RuleModalProps = {
    modal: boolean
    setModal: Dispatch<SetStateAction<boolean>>
}

export default function RuleModal({modal, setModal}: RuleModalProps) {
    return (
        <Modal display={modal} close={() => setModal(false)}>
            <div className='flex flex-col gap-4'>
                <h1 className='text-2xl font-bold'>Create new rule</h1>
                <input type='text' placeholder='Rule name' className='border border-gray-300 rounded p-2' />
                <textarea placeholder='Rule description' className='border border-gray-300 rounded p-2' />
                <button onClick={()=>{setModal(false)}} className='bg-blue-500 text-white rounded p-2'>Create</button>
            </div>
        </Modal>
    )
}
