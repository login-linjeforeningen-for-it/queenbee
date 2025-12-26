'use client'

import React from 'react'

function getColor(value: number, max: number) {
    if (value === 0) return '#181818'
    const levels = ['#653616', '#985122', '#ca6c2d', '#fd8738']
    const idx = Math.min(Math.floor((value / max) * levels.length), levels.length - 1)
    return levels[idx]
}

export default function Activity({ stats }: { stats: GetStatisticsYearlyActivityProps }) {
    const days = 7
    const weeks = 53

    const countMap = new Map<string, number>()
    stats.forEach(item => {
        countMap.set(item.insert_date, item.inserted_count)
    })

    const today = new Date()
    const thisSunday = new Date(today)
    thisSunday.setDate(today.getDate() - today.getDay())
    const startDate = new Date(thisSunday)
    startDate.setDate(thisSunday.getDate() - 52 * 7)

    const grid: number[][] = []
    for (let w = 0; w < weeks; w++) {
        const week: number[] = []
        for (let d = 0; d < days; d++) {
            const date = new Date(startDate)
            date.setDate(startDate.getDate() + w * 7 + d)
            const dateStr = date.toISOString().split('T')[0]
            const count = countMap.get(dateStr) || 0
            week.push(count)
        }
        grid.push(week)
    }

    const allCounts = Array.from(countMap.values())
    const max = Math.max(...allCounts, 1)

    const todayDay = today.getDay()
    grid[52] = grid[52].slice(0, todayDay + 1)

    return (
        <div>
            <div className='font-semibold text-lg py-4 text-center'>Activity last year</div>
            <div className='flex gap-0.5 bg-login-50/5 p-6 rounded-md'>
                {grid.map((week, wi) => (
                    <div key={wi} className='flex flex-col gap-0.5 flex-1'>
                        {week.map((val, di) => {
                            const date = new Date(startDate.getTime() + (wi * 7 + di) * 86400000)
                            return (
                                <div
                                    key={di}
                                    title={`${val} activities on ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                                    className='w-3 h-3 rounded-xs'
                                    style={{ background: getColor(val, max) }}
                                />
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}
