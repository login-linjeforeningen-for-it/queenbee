'use client'

import { useEffect, useState, useRef } from 'react'
import { countryCentroids } from '@/utils/geo'
import mapData from '@public/world.json'

interface TrafficBatch {
    iso: string
    count: number
    timestamp: string
}

type Ping = {
    id: number
    start: [number, number]
    end: [number, number]
    startTime: number
}

type LocalPing = {
    id: number
    location: [number, number]
    startTime: number
}

const MAP_WIDTH = 800
const MAP_HEIGHT = 400
const NO_COORDS: [number, number] = [62, 10]

function project([lat, lon]: [number, number]): [number, number] {
    return [(lon + 180) * (MAP_WIDTH / 360), (90 - lat) * (MAP_HEIGHT / 180)]
}

export default function TrafficMapPage() {
    const [status, setStatus] = useState('Connecting...')
    const [isConnected, setIsConnected] = useState(false)
    const [activePings, setActivePings] = useState<Ping[]>([])
    const [localPings, setLocalPings] = useState<LocalPing[]>([])
    const requestRef = useRef<number>(0)
    const queueRef = useRef<TrafficBatch[]>([])
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const baseTimeRef = useRef<number | null>(null)

    function processNextInQueue() {
        if (queueRef.current.length === 0) {
            timeoutRef.current = null
            baseTimeRef.current = null
            return
        }

        const item = queueRef.current.shift()!
        const now = Date.now()
        const iso = item.iso.toUpperCase()
        const endCoords = countryCentroids['NO'] || NO_COORDS

        if (baseTimeRef.current === null) {
            baseTimeRef.current = new Date(item.timestamp).getTime()
        }

        if (countryCentroids[iso]) {
            if (iso === 'NO') {
                for (let i = 0; i < Math.min(item.count, 3); i++) {
                    setLocalPings(prev => [...prev, { id: Math.random(), location: endCoords, startTime: now + (i * 100) }])
                }
            } else {
                setActivePings(prev => [...prev, { id: Math.random(), start: countryCentroids[iso], end: endCoords, startTime: now }])
            }
        }

        if (queueRef.current.length > 0) {
            const currentTime = new Date(item.timestamp).getTime()
            const nextTime = new Date(queueRef.current[0].timestamp).getTime()
            const delay = Math.max(50, Math.min(nextTime - currentTime, 2000))
            timeoutRef.current = setTimeout(processNextInQueue, delay)
        } else {
            timeoutRef.current = null
        }
    }

    useEffect(() => {
        const es = new EventSource('/api/live-traffic')

        es.onopen = () => {
            setStatus('Connected'); setIsConnected(true)
        }
        es.onmessage = (e) => {
            if (e.data === 'connected') setStatus('Receiving data...')
        }
        es.addEventListener('traffic', (e) => {
            try {
                queueRef.current.push(...JSON.parse((e as MessageEvent).data))
                if (!timeoutRef.current && queueRef.current.length > 0) processNextInQueue()
            } catch (err) {
                console.error('Error parsing traffic:', err)
            }
        })
        es.onerror = () => {
            setStatus('Disconnected')
            setIsConnected(false); es.close()
        }

        return () => {
            es.close()
            clearTimeout(timeoutRef.current!)
        }
    }, [])

    useEffect(() => {
        function cleanup() {
            const now = Date.now()
            setActivePings(prev => prev.filter(p => now - p.startTime < 2000))
            setLocalPings(prev => prev.filter(p => now - p.startTime < 1500))
            requestRef.current = requestAnimationFrame(cleanup)
        }
        requestRef.current = requestAnimationFrame(cleanup)
        return () => cancelAnimationFrame(requestRef.current)
    }, [])

    const paths = mapData.features.map((feature, i) => {
        let d = ''
        function drawRing(ring: number[][]) {
            return ring.reduce((p: string, pt: number[], j) => {
                const [x, y] = project([pt[1], pt[0]])
                return p + `${j === 0 ? 'M' : 'L'} ${x} ${y} `
            }, '') + 'Z '
        }
        const { type, coordinates } = feature.geometry
        if (type === 'Polygon') (coordinates as number[][][]).forEach((r: number[][]) => d += drawRing(r))
        else if (type === 'MultiPolygon')
            (coordinates as number[][][][]).forEach((poly: number[][][]) =>
                poly.forEach((r: number[][]) => d += drawRing(r))
            )
        return <path key={i} d={d} className='fill-white/5 stroke-white/10 stroke-[0.5] hover:fill-white/10 transition-colors' />
    })

    return (
        <div className='h-full flex flex-col p-6 space-y-6 overflow-hidden'>
            <header className='flex justify-between items-center'>
                <div>
                    <h1 className='text-2xl font-bold text-login'>
                        Live Traffic Map
                    </h1>
                    <p className='text-login-400 text-sm'>Real-time traffic visualization</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border backdrop-blur ${
                    isConnected ? 'bg-login/10 text-login border-login/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                }`}>
                    <span className='relative flex h-2 w-2'>
                        <span className={`animate-ping absolute h-full w-full rounded-full opacity-75 ${
                            isConnected ? 'bg-login' : 'bg-red-500'
                        }`} />
                        <span className={`relative rounded-full h-2 w-2 ${
                            isConnected ? 'bg-login' : 'bg-red-500'
                        }`} />
                    </span>
                    {status}
                </div>
            </header>

            <div className='relative flex-1 rounded-xl overflow-hidden flex items-center justify-center'>
                <div className='absolute inset-0 bg-gradient-radial from-login-900/50 via-login-950 to-login-950' />

                {!mapData && <div className='text-login-500 animate-pulse font-mono'>INITIALIZING MAP...</div>}

                {mapData && (
                    <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className='w-full h-full max-h-[80vh] relative z-10'>
                        <g className='opacity-80'>{paths}</g>

                        {activePings.map(ping => {
                            const [x1, y1] = project(ping.start), [x2, y2] = project(ping.end)
                            const dx = x2 - x1, dy = y2 - y1, dist = Math.sqrt(dx * dx + dy * dy)
                            const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2 - (dist * 0.5)
                            const progress = (Date.now() - ping.startTime) / 2000, t = progress, it = 1 - t
                            const px = (it * it * x1) + (2 * it * t * cx) + (t * t * x2)
                            const py = (it * it * y1) + (2 * it * t * cy) + (t * t * y2)
                            const opacity = progress < 0.1 ? progress * 10 : (progress > 0.9 ? (1 - progress) * 10 : 1)

                            return (
                                <g key={ping.id}>
                                    <path d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`} className='stroke-login/20 fill-none' />
                                    <circle cx={px} cy={py} r='2' className='fill-login blur-[1px]' style={{ opacity }} />
                                    <circle cx={px} cy={py} r='1' className='fill-white' style={{ opacity }} />
                                </g>
                            )
                        })}

                        {localPings.map(ping => {
                            const [lx, ly] = project(ping.location)
                            const progress = (Date.now() - ping.startTime) / 1500
                            const radius = 3 + (progress * 20), opacity = Math.max(0, 1 - progress)

                            return (
                                <g key={ping.id}>
                                    <circle
                                        cx={lx}
                                        cy={ly}
                                        r={radius}
                                        className='fill-none stroke-green-400 stroke-2'
                                        style={{ opacity: opacity * 0.6 }}
                                    />
                                    <circle
                                        cx={lx}
                                        cy={ly}
                                        r={radius * 0.7}
                                        className='fill-none stroke-green-300'
                                        style={{ opacity: opacity * 0.4 }}
                                    />
                                </g>
                            )
                        })}

                        <circle
                            cx={project(NO_COORDS)[0]}
                            cy={project(NO_COORDS)[1]}
                            r='6'
                            className='fill-login animate-pulse opacity-30 blur-sm'
                        />
                        <circle cx={project(NO_COORDS)[0]} cy={project(NO_COORDS)[1]} r='3' className='fill-white' />
                    </svg>
                )}
            </div>
        </div>
    )
}
