"use client"
import Modal from "@components/modal/modal";
import { useState } from "react";

export default function page() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
        {showModal && (
          <Modal close={() => setShowModal(false)}>
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl font-bold">Create new rule</h1>
                    <input type="text" placeholder="Rule name" className="border border-gray-300 rounded p-2" />
                    <textarea placeholder="Rule description" className="border border-gray-300 rounded p-2" />
                    <button onClick={()=>{setShowModal(false)}} className="bg-blue-500 text-white rounded p-2">Create</button>
                </div>
            </Modal>
        )}
        <div className="w-full relative">
            <button onClick={()=>{setShowModal(true)}}>New rule</button>
        </div>
        </>
    )
}
