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
        <div className='bg-login-50/5 p-4 rounded-lg'>
            <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-semibold'>{currentTitle}</h3>
                <Button
                    icon={<LucideChartNoAxesGantt className='w-5' />}
                    text={buttonText}
                    onClick={() => setIndex(index === 0 ? 1 : 0)}
                />
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
