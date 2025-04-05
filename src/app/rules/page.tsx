"use client"
import Modal from "@components/modal/modal";
import TextInput from "@components/userInput/textInput";
import { useState } from "react";

export default function page() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
        {showModal && (
          <Modal close={() => setShowModal(false)}>
                <div className="flex flex-col gap-4">
                </div>
            </Modal>
        )}
        <div className="w-full relative">
            <button onClick={()=>{setShowModal(true)}}>New rule</button>
            <form>
                <TextInput width={200} placeholder="Hello" required={true}></TextInput>
                <input type="submit" value={"Submit"}/>
            </form>
        </div>
        </>
    )
}
