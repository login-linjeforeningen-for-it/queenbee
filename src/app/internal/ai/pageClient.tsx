'use client'

import GPT_Content from '@components/gpt/content'
import TestClientPopup from '@components/gpt/testClientPopup'
import config from '@config'
import { Bot, Eye, Wifi, WifiOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type ChatSession = {
    clientName: string
    conversationId: string
    messages: GPT_ChatMessage[]
    isSending: boolean
    metrics: GPT_ModelMetrics
}

export default function GPT_Page() {
    const [clients, setClients] = useState<GPT_Client[]>([])
    const [reconnect, setReconnect] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [participants, setParticipants] = useState(1)
    const [chatSession, setChatSession] = useState<ChatSession | null>(null)
    const socketRef = useRef<WebSocket | null>(null)

    useEffect(() => {
        const ws = new WebSocket(`${config.url.beekeeper_wss}/client/ws/beeswarm`)
        socketRef.current = ws

        ws.onopen = () => {
            setReconnect(false)
            setIsConnected(true)
        }

        ws.onclose = () => {
            setIsConnected(false)
            socketRef.current = null
        }

        ws.onerror = (error) => {
            console.log('WebSocket error:', error)
            setIsConnected(false)
        }

        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data) as {
                    type?: string
                    participants?: number
                    client?: GPT_Client
                    conversationId?: string
                    clientName?: string | null
                    delta?: string
                    content?: string
                    error?: string
                    metrics?: GPT_ModelMetrics
                }

                switch (msg.type) {
                    case 'update':
                        if (!msg.client) {
                            return
                        }

                        setParticipants(msg.participants || 0)
                        setClients((prev) => {
                            const existing = prev.find(client => client.name === msg.client?.name)
                            if (!existing) {
                                return [...prev, msg.client as GPT_Client]
                            }

                            return prev.map(client =>
                                client.name === msg.client?.name
                                    ? { ...client, ...msg.client }
                                    : client
                            )
                        })

                        setChatSession((prev) => {
                            if (!prev || prev.clientName !== msg.client?.name) {
                                return prev
                            }

                            return {
                                ...prev,
                                metrics: msg.client.model,
                            }
                        })
                        return

                    case 'join':
                        setParticipants(msg.participants || 0)
                        return

                    case 'prompt_started':
                        setChatSession((prev) => {
                            if (!prev || prev.conversationId !== msg.conversationId) {
                                return prev
                            }

                            return {
                                ...prev,
                                isSending: true,
                                metrics: msg.metrics || prev.metrics,
                                messages: prev.messages.some(message => message.role === 'assistant' && message.pending)
                                    ? prev.messages
                                    : [
                                        ...prev.messages,
                                        {
                                            id: `${prev.conversationId}-assistant`,
                                            role: 'assistant',
                                            content: '',
                                            pending: true,
                                        }
                                    ],
                            }
                        })
                        return

                    case 'prompt_delta':
                        setChatSession((prev) => {
                            if (!prev || prev.conversationId !== msg.conversationId) {
                                return prev
                            }

                            const nextMessages = [...prev.messages]
                            const lastMessage = nextMessages[nextMessages.length - 1]
                            if (lastMessage?.role === 'assistant') {
                                nextMessages[nextMessages.length - 1] = {
                                    ...lastMessage,
                                    content: msg.content || `${lastMessage.content}${msg.delta || ''}`,
                                    pending: true,
                                }
                            }

                            return {
                                ...prev,
                                isSending: true,
                                metrics: msg.metrics || prev.metrics,
                                messages: nextMessages,
                            }
                        })
                        return

                    case 'prompt_complete':
                        setChatSession((prev) => {
                            if (!prev || prev.conversationId !== msg.conversationId) {
                                return prev
                            }

                            const nextMessages = [...prev.messages]
                            const lastMessage = nextMessages[nextMessages.length - 1]
                            if (lastMessage?.role === 'assistant') {
                                nextMessages[nextMessages.length - 1] = {
                                    ...lastMessage,
                                    content: msg.content || lastMessage.content,
                                    pending: false,
                                }
                            }

                            return {
                                ...prev,
                                isSending: false,
                                metrics: msg.metrics || prev.metrics,
                                messages: nextMessages,
                            }
                        })
                        return

                    case 'prompt_error':
                        setChatSession((prev) => {
                            if (!prev || prev.conversationId !== msg.conversationId) {
                                return prev
                            }

                            const nextMessages = [...prev.messages]
                            const lastMessage = nextMessages[nextMessages.length - 1]
                            if (lastMessage?.role === 'assistant' && lastMessage.pending) {
                                nextMessages[nextMessages.length - 1] = {
                                    ...lastMessage,
                                    content: msg.error || 'The model failed to answer this prompt.',
                                    pending: false,
                                    error: true,
                                }
                            } else {
                                nextMessages.push({
                                    id: `${prev.conversationId}-error-${Date.now()}`,
                                    role: 'assistant',
                                    content: msg.error || 'The model failed to answer this prompt.',
                                    error: true,
                                })
                            }

                            return {
                                ...prev,
                                isSending: false,
                                metrics: msg.metrics || {
                                    ...prev.metrics,
                                    status: 'error',
                                    lastError: msg.error || 'The model failed to answer this prompt.',
                                },
                                messages: nextMessages,
                            }
                        })
                        return

                    default:
                        return
                }
            } catch (err) {
                console.error('Invalid message from server:', err)
            }
        }

        return () => {
            ws.close()
        }
    }, [reconnect])

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!isConnected) {
                setReconnect(true)
            }
        }, 3000)

        return () => clearTimeout(timeout)
    }, [isConnected])

    function openChat(client: GPT_Client) {
        setChatSession((prev) => {
            if (prev?.clientName === client.name) {
                return {
                    ...prev,
                    metrics: client.model,
                }
            }

            return {
                clientName: client.name,
                conversationId: crypto.randomUUID(),
                messages: [],
                isSending: false,
                metrics: client.model,
            }
        })
    }

    function sendPrompt(content: string) {
        if (!chatSession || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            return
        }

        const userMessage: GPT_ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content,
        }

        const requestMessages = [...chatSession.messages, userMessage]
            .filter(message => message.role === 'user' || message.role === 'assistant')
            .map(message => ({
                role: message.role,
                content: message.content,
            }))

        setChatSession((prev) => prev ? {
            ...prev,
            isSending: true,
            messages: [
                ...prev.messages,
                userMessage,
                {
                    id: `${prev.conversationId}-assistant`,
                    role: 'assistant',
                    content: '',
                    pending: true,
                }
            ],
        } : prev)

        socketRef.current.send(JSON.stringify({
            type: 'prompt_request',
            conversationId: chatSession.conversationId,
            clientName: chatSession.clientName,
            messages: requestMessages,
            maxTokens: 512,
            temperature: 0.7,
        }))
    }

    const activeClient = chatSession
        ? clients.find(client => client.name === chatSession.clientName) || null
        : null

    return (
        <>
            <div className='h-full w-full overflow-y-auto noscroll'>
                <div className='flex w-full flex-col gap-4 pb-4'>
                    <div
                        className='w-full rounded-2xl border border-login-100/10 bg-login-900/70
                            p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]'
                    >
                        <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                            <div>
                                <h1 className='font-semibold text-lg'>AI (Login GPT)</h1>
                                <p className='max-w-2xl text-sm text-login-100'>
                                    Live metrics from connected inference clients.
                                </p>
                            </div>
                            <div className='grid gap-3 sm:grid-cols-2 lg:min-w-[24rem]'>
                                <div className='rounded-xl border border-login-100/10 bg-login-50/5 p-4'>
                                    <div className='flex items-center justify-between text-login-200'>
                                        <span className='text-xs font-medium uppercase tracking-[0.18em]'>Viewers</span>
                                        <Eye className='h-4 w-4' />
                                    </div>
                                    <div className='mt-3 text-3xl font-semibold text-login-50'>{participants}</div>
                                </div>
                                <div className='rounded-xl border border-login-100/10 bg-login-50/5 p-4'>
                                    <div className='flex items-center justify-between text-login-200'>
                                        <span className='text-xs font-medium uppercase tracking-[0.18em]'>Connection</span>
                                        {isConnected
                                            ? <Wifi className='h-4 w-4 text-emerald-400' />
                                            : <WifiOff className='h-4 w-4 text-red-400' />}
                                    </div>
                                    <div
                                        className={`
                                            mt-3 text-sm font-semibold uppercase tracking-[0.18em]
                                            ${isConnected ? 'text-emerald-400' : 'text-red-400'}
                                        `}
                                    >
                                        {isConnected ? 'Connected' : 'Reconnecting'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {clients.length ? (
                        <GPT_Content
                            clients={clients}
                            onTestClient={openChat}
                        />
                    ) : (
                        <div className='w-full rounded-2xl border border-login-100/10 bg-login-900/50 px-6 py-10 text-center'>
                            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-login-50/5 text-login'>
                                <Bot className='h-6 w-6' />
                            </div>
                            <h2 className='mt-4 font-semibold text-login-50'>No GPTs connected</h2>
                            <p className='mt-2 text-sm text-login-100'>
                                The dashboard will populate automatically when a client joins the room.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {chatSession && activeClient ? (
                <TestClientPopup
                    client={activeClient}
                    conversationId={chatSession.conversationId}
                    isSending={chatSession.isSending}
                    messages={chatSession.messages}
                    metrics={chatSession.metrics}
                    onClose={() => setChatSession(null)}
                    onSend={sendPrompt}
                />
            ) : null}
        </>
    )
}
