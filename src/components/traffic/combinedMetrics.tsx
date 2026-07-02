import { useState } from 'react'
import { Card, Toggle } from 'uibee/components'

function Bar({ label, value, total }: { label: string, value: number, total: number }) {
    const percentage = total ? (value / total) * 100 : 0
    return (
        <div className='flex items-center gap-4 min-w-0 group'>
            <div
                className={`
                    w-24 md:w-48 text-xs font-medium truncate text-login-100
                    group-hover:text-login-50 transition-colors
                `}
                title={label}
            >
                {label}
            </div>
            <div className='flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 relative'>
                <div
                    className='h-full bg-linear-to-r from-login to-amber-500 rounded-full relative z-10'
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className='w-16 text-xs text-right text-login-200 tabular-nums font-mono'>{value}</div>
        </div>
    )
}

export default function CombinedMetrics({ title, data, total }: {
    title: string[],
    data: Entry[][],
    total: number
}) {
    const [index, setIndex] = useState(0)
    const currentData = data[index]

    return (
        <Card className='p-4 min-h-50 flex flex-col'>
            <div className='flex justify-between items-center mb-4'>
                <Toggle
                    value={index}
                    onChange={(next) => setIndex(next as number)}
                    left={{ value: 0, text: title[0] }}
                    right={{ value: 1, text: title[1] }}
                />
            </div>
            <div className='space-y-2'>
                {currentData.map((entry) => (
                    <Bar
                        key={entry.key}
                        label={entry.key}
                        value={'count' in entry ? (entry.count || 0) : Math.round(entry.avg_time || 0)}
                        total={total}
                    />
                ))}
            </div>
        </Card>
    )
}
