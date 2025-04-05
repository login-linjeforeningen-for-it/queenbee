"use client"
import Modal from "@components/modal/modal";
import { useState } from "react";

export default function page() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="w-full">
            <button onClick={()=>{setShowModal(true)}}>New rule</button>
            {showModal && (
                Modal({
                    children: <div>Hello</div>,
                    onClose: () => {setShowModal(false)}
                }))}
        </div>
    )
}
