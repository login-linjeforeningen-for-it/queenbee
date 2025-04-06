'use client'
import config from "@config"
import sendNotificationClient from "@utils/notification/sendNotificationClient"
import Link from "next/link"
import { Dispatch, SetStateAction, useState } from "react"

type BarProps = {
    title: string
    content: string
    placeholder: string
    setContent: Dispatch<SetStateAction<string>>
}

export default function page() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [topic, setTopic] = useState("")
    const [screen, setScreen] = useState("")
    const [result, setResult] = useState<SendResponseClient | null>()

    async function handleSend() {
        const response = await sendNotificationClient({title, description, screen, topic})
        if (response) {
            setResult(response)
            if (response.status === 200) {
                setTimeout(() => {
                    setResult(null)
                }, 2000)
            }
        }
    }

    return (
        <div className="h-full">
            <h1 className="font-semibold text-lg">Nucleus</h1>
            <div className="grid place-items-center self-center h-full">
                <div>
                    <h1 className="rounded-lg pb-4 text-center">Send a notification to the Login App</h1>
                    {result?.status && <h1 className={`rounded-md text-center mb-4 py-1 ${result.status === 200 ? 'bg-green-500' : 'bg-red-500'}`}>{result?.message}</h1>}
                    <div className="flex flex-col w-[40vw] h-[40vh] bg-sidebar p-4 rounded-md relative gap-2">
                        <Bar title="Title" placeholder="Viktig beskjed til alle i Login..." content={title} setContent={setTitle} />
                        <Bar title="Description" placeholder="Event ... har blitt flyttet frem en time!" content={description} setContent={setDescription} />
                        <Bar title="Topic" placeholder="nTEKKOM / n191w" content={topic} setContent={setTopic} />
                        <Bar title="Screen" placeholder="191" content={screen} setContent={setScreen} />
                        <Link
                            href={`${config.url.CDN_URL}/files/misc/push_notifications.pdf`}
                            className="absolute bottom-4 bg-light px-6 rounded-lg py-1"
                        >Documentation</Link>
                        <h1 
                            className="absolute bottom-4 right-4 bg-login rounded-lg px-8 py-1"
                            onClick={(() => handleSend())}
                        >Send</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Bar({title, content, setContent, placeholder}: BarProps) {
    return (
        <div className="flex h-8 w-full">
            <h1 className="min-w-[7vw] max-w-[6vw] flex items-center">{title}</h1>
            <input 
                placeholder={placeholder}
                onChange={(event) => setContent(event.target.value)}
                className="w-full align-center bg-light rounded-md px-2" 
                value={content} 
            />
        </div>
    )
}
