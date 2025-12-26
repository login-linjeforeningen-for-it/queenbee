'use client'

import { useState } from 'react'

export default function StatisticsCategories({ categories }: { categories: GetStatisticsCategoriesProps }) {
    const [hovered, setHovered] = useState<number | null>(null)
    const total = categories.reduce((sum, cat) => sum + cat.event_count, 0)
    let angle = -90

    const slices = categories.map(cat => {
        const sliceAngle = (cat.event_count / total) * 360
        const startAngle = angle
        const endAngle = angle + sliceAngle
        angle = endAngle

        const radius = 100
        const centerX = 150
        const centerY = 150

        const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180)
        const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180)
        const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180)
        const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180)

        const largeArcFlag = sliceAngle > 180 ? 1 : 0
        const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

        return { pathData, color: cat.color, label: cat.name_en, count: cat.event_count }
    })

    return (
        <div className='w-full flex flex-col pt-6'>
            <h2 className='font-semibold text-lg pb-4 mx-auto'>Event Categories</h2>
            <div className='flex flex-col items-center w-full bg-login-50/5 rounded-md'>
                <svg width='300' height='300' viewBox='0 0 300 300'>
                    {slices.map((slice, i) => (
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
                    ))}
                </svg>
                <div className='flex flex-wrap justify-center mt-4 pb-4'>
                    {slices.map((slice, i) => (
                        <div key={i} className='flex items-center mr-4 mb-2'>
                            <div className='w-4 h-4 rounded' style={{backgroundColor: slice.color}}></div>
                            <span className='ml-2 text-sm text-white'>{slice.label} ({slice.count})</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}