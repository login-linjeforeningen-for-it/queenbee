'use client'

import { useState } from 'react'

const cx = 150
const cy = 150
const r = 100

export default function StatisticsCategories({ categories }: { categories: GetStatisticsCategoriesProps }) {
    const [hovered, setHovered] = useState<number | null>(null)
    const total = categories.reduce((sum, cat) => sum + cat.event_count, 0)

    const isEmpty = categories.length === 0 || total === 0
    const isSingle = categories.length === 1

    let angle = -90
    const slices = categories.map(cat => {
        const sliceAngle = (cat.event_count / total) * 360
        const startAngle = angle
        const endAngle = angle + sliceAngle
        angle = endAngle

        const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180)
        const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180)
        const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180)
        const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180)

        const largeArcFlag = sliceAngle > 180 ? 1 : 0
        const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

        return { pathData, color: cat.color, label: cat.name_en, count: cat.event_count }
    })

    return (
        <div className='w-full flex flex-col pt-6 h-full'>
            <h2 className='font-semibold text-lg pb-4 mx-auto'>Event Categories</h2>
            <div className='flex flex-col h-full items-center justify-center w-full bg-login-50/5 rounded-md'>
                <svg width='400' height='400' viewBox='0 0 300 300'>
                    {isEmpty ? (
                        <circle cx={cx} cy={cy} r={r} fill='none' stroke='#ffffff20' strokeWidth='2' />
                    ) : isSingle ? (
                        <circle
                            cx={cx}
                            cy={cy}
                            r={r}
                            fill={slices[0].color}
                            stroke='#fff'
                            strokeWidth='1'
                            className='cursor-pointer'
                            onMouseEnter={() => setHovered(0)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <title>{`${slices[0].label}: ${slices[0].count} events`}</title>
                        </circle>
                    ) : (
                        slices.map((slice, i) => (
                            <path
                                key={i}
                                d={slice.pathData}
                                fill={slice.color}
                                stroke='#fff'
                                strokeWidth='1'
                                style={{ opacity: hovered === null || hovered === i ? 1 : 0.6 }}
                                onMouseEnter={() => setHovered(i)}
                                onMouseLeave={() => setHovered(null)}
                                className='cursor-pointer'
                            >
                                <title>{`${slice.label}: ${slice.count} events`}</title>
                            </path>
                        ))
                    )}
                </svg>
                {isEmpty ? (
                    <p className='text-sm text-white/40 pb-4'>No categories yet</p>
                ) : (
                    <div className='flex flex-wrap justify-center mt-4 pb-4'>
                        {slices.map((slice, i) => (
                            <div key={i} className='flex items-center mr-4 mb-2'>
                                <div className='w-4 h-4 rounded' style={{ backgroundColor: slice.color }}></div>
                                <span className='ml-2 text-sm text-white'>{slice.label} ({slice.count})</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
