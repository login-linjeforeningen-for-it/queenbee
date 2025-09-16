'use client'

import React from 'react'

function getColor(value: number, max: number) {
    if (value === 0) return '##181818'
    const levels = ['#653616', '#985122', '#ca6c2d', '#fd8738']
    const idx = Math.min(Math.floor((value / max) * levels.length), levels.length - 1)
    return levels[idx]
}

export default function Activity({ stats }: { stats: number[] }) {
    const days = 7
    const weeks = 52
    const grid: number[][] = Array.from({ length: weeks }, (_, w) =>
        Array.from({ length: days }, (_, d) => stats[w * days + d] || 0)
    )
    const max = Math.max(...stats, 1)

    return (
        <div>
            <div className='mb-2'>Activity last year</div>
            <div className='flex gap-[2px]'>
                {grid.map((week, wi) => (
                    <div key={wi} className='flex flex-col gap-[2px]'>
                        {week.map((val, di) => (
                            <div
                                key={di}
                                title={`Day ${di + 1}, Week ${wi + 1}: ${val}`}
                                className='w-[12px] h-[12px] rounded-[2px] border border-login-400'
                                style={{ background: getColor(val, max) }}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}
