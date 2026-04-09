'use client'
import GPT_Content from '@components/gpt/content'
import config from '@config'
import { Bot, Eye, Wifi, WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function GPT_Page() {
    const [clients, setClients] = useState<GPT_Client[]>([])
    const [reconnect, setReconnect] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [participants, setParticipants] = useState(1)

    useEffect(() => {
        const ws = new WebSocket(`${config.url.beekeeper_wss}/client/ws/beeswarm`)

        ws.onopen = () => {
            setReconnect(false)
            setIsConnected(true)
        }

        ws.onclose = () => {
            setIsConnected(false)
        }

        ws.onerror = (error) => {
            console.log('WebSocket error:', error)
            setIsConnected(false)
        }

        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data)
                if (msg.type === 'update') {
                    setParticipants(msg.participants)
                    setClients((prev) => {
                        const existing = prev.find(client => client.name === msg.client.name)
                        if (existing) {
                            return prev.map(client =>
                                client.name === msg.client.name
                                    ? { ...client, ...msg.client }
                                    : client
                            )
                        } else {
                            return [...prev, msg.client]
                        }
                    })
                }

                if (msg.type === 'join') {
                    setParticipants(msg.participants)
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

    return (
        <div className='h-full overflow-y-auto noscroll'>
            <div className='flex flex-col gap-4 pb-4'>
                <div className='rounded-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]'>
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
                    <GPT_Content clients={clients} />
                ) : (
                    <div className='px-6 py-10 text-center'>
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
    )
}
