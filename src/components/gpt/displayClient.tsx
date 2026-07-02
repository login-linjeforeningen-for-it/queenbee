'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Cpu, Gauge, HardDrive, MemoryStick, MessageSquareText } from 'lucide-react'
import { Button, Card } from 'uibee/components'
import ResourceRow from './resourceRow'
import Metric from './metric'

export default function DisplayClient({
    client,
    onTestClient,
}: {
    client: GPT_Client
    onTestClient: (client: GPT_Client) => void
}) {
    const [open, setOpen] = useState(false)

    const stats = {
        ram: averageMetric(client.ram.map(ram => ram.load)),
        cpu: averageMetric(client.cpu.map(cpu => cpu.load)),
        gpu: averageMetric(client.gpu.map(gpu => gpu.load)),
    }

    return (
        <Card className='w-full p-4'>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
                    <div>
                        <h3 className='text-lg font-semibold text-login-50'>{client.name}</h3>
                        <p className='text-sm text-login-200'>
                            {client.ram.length} RAM, {client.cpu.length} CPU, {client.gpu.length} GPU sensors
                        </p>
                    </div>
                    <div className='flex flex-wrap items-center gap-2'>
                        <Metric label='RAM' metric={stats.ram} />
                        <Metric label='CPU' metric={stats.cpu} />
                        <Metric label='GPU' metric={stats.gpu} />
                        <StatPill
                            label='TPS'
                            value={`${client.model.tps.toFixed(1)}`}
                            icon={<Gauge className='h-3.5 w-3.5' />}
                        />
                        <Button
                            variant='secondary'
                            icon={open ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
                            onClick={() => setOpen(prev => !prev)}
                        />
                    </div>
                </div>
                <div className='grid gap-3 border-t border-login-500/25 pt-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center'>
                    <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
                        <ModelStat title='Current tokens' value={client.model.currentTokens.toString()} />
                        <ModelStat title='Max tokens' value={client.model.maxTokens.toString()} />
                        <ModelStat
                            title='Context'
                            value={`${client.model.contextTokens}/${client.model.contextMaxTokens || 0}`}
                        />
                        <ModelStat title='Status' value={client.model.status} highlight={client.model.status} />
                    </div>
                    <div className='flex justify-start md:justify-end'>
                        <Button
                            text='Test client'
                            icon={<MessageSquareText className='h-4 w-4' />}
                            onClick={() => onTestClient(client)}
                        />
                    </div>
                </div>
                {open ? <Open client={client} /> : null}
            </div>
        </Card>
    )
}

function Open({ client }: { client: GPT_Client }) {
    return (
        <div className='grid gap-4 border-t border-login-500/25 pt-4 lg:grid-cols-3'>
            <MetricSection
                title='RAM'
                icon={<MemoryStick className='h-4 w-4' />}
                items={client.ram.map((ram, id) => <ResourceRow key={`${ram.name}-${id}`} name={ram.name} load={ram.load} />)}
            />
            <MetricSection
                title='CPU'
                icon={<Cpu className='h-4 w-4' />}
                items={client.cpu.map((cpu, id) => <ResourceRow key={`${cpu.name}-${id}`} name={cpu.name} load={cpu.load} />)}
            />
            <MetricSection
                title='GPU'
                icon={<HardDrive className='h-4 w-4' />}
                items={client.gpu.map((gpu, id) => <ResourceRow key={`${gpu.name}-${id}`} name={gpu.name} load={gpu.load} />)}
            />
        </div>
    )
}

function MetricSection({ title, icon, items }: { title: string, icon: ReactNode, items: ReactNode[] }) {
    return (
        <Card className='p-4'>
            <div className='mb-3 flex items-center gap-2 text-login-200'>
                {icon}
                <h4 className='text-sm font-semibold uppercase tracking-[0.18em]'>{title}</h4>
            </div>
            <div className='space-y-2'>
                {items.length ? items : <p className='text-sm text-login-200'>No metrics reported.</p>}
            </div>
        </Card>
    )
}

function StatPill({ label, value, icon }: { label: string, value: string, icon: ReactNode }) {
    return (
        <span
            className='inline-flex items-center gap-2 rounded-full border border-login-500/30
                bg-login-600 px-3 py-1 text-sm font-semibold text-login-50'
        >
            {icon}
            <span className='text-[10px] uppercase tracking-[0.18em] text-login-200'>{label}</span>
            <span>{value}</span>
        </span>
    )
}

function ModelStat({ title, value, highlight }: { title: string, value: string, highlight?: string }) {
    const highlightClass = highlight === 'error'
        ? 'text-red-400'
        : highlight === 'generating'
            ? 'text-emerald-400'
            : highlight === 'preparing'
                ? 'text-yellow-400'
                : 'text-login-50'

    return (
        <Card className='px-3 py-2'>
            <div className='text-[10px] uppercase tracking-[0.18em] text-login-200'>{title}</div>
            <div className={`mt-1 text-sm font-semibold ${highlightClass}`}>{value}</div>
        </Card>
    )
}

function averageMetric(values: number[]) {
    if (!values.length) {
        return 0
    }

    return Math.ceil(values.reduce((sum, value) => sum + value, 0) / values.length * 100)
}
