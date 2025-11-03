'use client'

import { Chart as ChartJS, ArcElement, Tooltip, Legend, TooltipItem } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function StatisticsCategories({ categories }: { categories: GetStatisticsCategoriesProps }) {
    const data = {
        labels: categories.map(cat => cat.name_en),
        datasets: [
            {
                data: categories.map(cat => cat.event_count),
                backgroundColor: categories.map(cat => cat.color),
                borderWidth: 1,
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context: TooltipItem<'pie'>) {
                        const label = context.label || ''
                        const value = context.parsed || 0
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                        const percentage = ((value / total) * 100).toFixed(1)
                        return `${label}: ${value} events (${percentage}%)`
                    }
                }
            }
        },
    }

    return (
        <div className='h-full w-fit flex flex-col pt-6'>
            <h2 className='font-semibold text-lg pb-4 mx-auto'>Event Categories</h2>
            <div className='bg-white/5 rounded-md h-full aspect-square mx-auto p-10'>
                <Pie data={data} options={options} height='100%' width='auto' />
            </div>
        </div>
    )
}