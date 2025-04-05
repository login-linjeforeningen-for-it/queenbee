'use client'
import config from "@config"
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
    // --background: #0a0a0a;
	// --foreground: #ededed;
	// --color-dark: #1a1a1a;
	// --color-sidebar: #121212;
	// --color-normal: #171717;
	// --color-light: #212121;
	// --color-extralight: #323232;
	// --color-superlight: #424242;
	// --color-bright: white;
	// --color-login: #fd8738;
    return (
        <div className="h-full">
            <h1 className="font-semibold text-lg">Nucleus</h1>
            <div className="grid place-items-center self-center h-full">
                <div>
                    <h1 className="rounded-lg pb-4 text-center">Send a notification to the Login App</h1>
                    <div className="flex flex-col w-[40vw] h-[40vh] bg-sidebar p-4 rounded-md relative gap-2">
                        <Bar title="Title" placeholder="Viktig beskjed til alle i Login..." content={title} setContent={setTitle} />
                        <Bar title="Description" placeholder="Event ... har blitt flyttet frem en time!" content={description} setContent={setDescription} />
                        <Bar title="Topic" placeholder="nTEKKOM / n191w" content={topic} setContent={setTopic} />
                        <Bar title="Screen" placeholder="191" content={screen} setContent={setScreen} />
                        <Link
                            href={`${config.url.CDN_URL}/files/misc/push_notifications.pdf`}
                            className="absolute bottom-4 bg-light px-6 rounded-lg py-1"
                        >Documentation</Link>
                        <h1 className="absolute bottom-4 right-4 bg-login rounded-lg px-8 py-1">Send</h1>
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
