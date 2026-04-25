import { LucideChartNoAxesGantt } from 'lucide-react'
import { useState } from 'react'
import { Button } from 'uibee/components'
import Bar from './bar'

export default function CombinedMetrics({ title, data, total }: {
    title: string[],
    data: Entry[][],
    total: number
}) {
    const [index, setIndex] = useState(0)
    const currentData = data[index]
    const currentTitle = title[index]
    const buttonText = `Switch to ${title[1 - index]}`

    return (
        <div className='bg-login-50/5 p-4 rounded-xl border border-white/5 min-h-[200px] flex flex-col'>
            <div className='flex justify-between items-center mb-4'>
                <div className='flex bg-white/5 p-0.5 rounded-lg border border-white/5'>
                    {title.map((t, i) => (
                        <button
                            key={t}
                            onClick={() => setIndex(i)}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${index === i ? 'bg-white/10 text-white shadow-sm' : 'text-login-200 hover:text-login-100 hover:bg-white/5'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>
            <div className='space-y-2'>
                {currentData.map((entry) => (
                    <Bar
                        key={entry.key}
                        label={entry.key} value={'count' in entry ? (entry.count || 0) : Math.round(entry.avg_time || 0)}
                        total={total} />
                ))}
            </div>
        </div>
    )
}
