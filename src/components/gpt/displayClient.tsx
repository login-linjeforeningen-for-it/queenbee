'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Cpu, HardDrive, MemoryStick } from 'lucide-react'
import CPU from './cpu'
import GPU from './gpu'
import RAM from './ram'
import Metric from './metric'

export default function DisplayClient({ client }: { client: GPT_Client }) {
    const [open, setOpen] = useState(false)

    const stats = {
        ram: averageMetric(client.ram.map(ram => ram.load)),
        cpu: averageMetric(client.cpu.map(cpu => cpu.load)),
        gpu: averageMetric(client.gpu.map(gpu => gpu.load)),
    }

    return (
        <button
            type='button'
            className='w-full rounded-2xl border border-login-100/10 bg-login-900/50 p-4 text-left transition-colors hover:bg-login-800/50'
            onClick={() => setOpen(prev => !prev)}
        >
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
                    <div>
                        <h3 className='text-lg font-semibold text-login-50'>{client.name}</h3>
                        <p className='text-sm text-login-100'>
                            {client.ram.length} RAM, {client.cpu.length} CPU, {client.gpu.length} GPU sensors
                        </p>
                    </div>
                    <div className='flex flex-wrap items-center gap-2'>
                        <Metric label='RAM' metric={stats.ram} />
                        <Metric label='CPU' metric={stats.cpu} />
                        <Metric label='GPU' metric={stats.gpu} />
                        <span
                            className='flex h-9 w-9 items-center justify-center rounded-full border
                                border-login-100/10 bg-login-50/5 text-login-200'
                        >
                            {open ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
                        </span>
                    </div>
                </div>
                {open ? <Open client={client} /> : null}
            </div>
        </button>
    )
}

function Open({ client }: { client: GPT_Client }) {
    return (
        <div className='grid gap-4 border-t border-login-100/10 pt-4 lg:grid-cols-3'>
            <MetricSection
                title='RAM'
                icon={<MemoryStick className='h-4 w-4' />}
                items={client.ram.map((ram, id) => <RAM key={`${ram.name}-${id}`} ram={ram} />)}
            />
            <MetricSection
                title='CPU'
                icon={<Cpu className='h-4 w-4' />}
                items={client.cpu.map((cpu, id) => <CPU key={`${cpu.name}-${id}`} cpu={cpu} />)}
            />
            <MetricSection
                title='GPU'
                icon={<HardDrive className='h-4 w-4' />}
                items={client.gpu.map((gpu, id) => <GPU key={`${gpu.name}-${id}`} gpu={gpu} />)}
            />
        </div>
    )
}

function MetricSection({ title, icon, items }: { title: string, icon: ReactNode, items: ReactNode[] }) {
    return (
        <div className='rounded-xl border border-login-100/10 bg-login-50/5 p-4'>
            <div className='mb-3 flex items-center gap-2 text-login-200'>
                {icon}
                <h4 className='text-sm font-semibold uppercase tracking-[0.18em]'>{title}</h4>
            </div>
            <div className='space-y-2'>
                {items.length ? items : <p className='text-sm text-login-100'>No metrics reported.</p>}
            </div>
        </div>
    )
}

function averageMetric(values: number[]) {
    if (!values.length) {
        return 0
    }

    return Math.ceil(values.reduce((sum, value) => sum + value, 0) / values.length * 100)
}
