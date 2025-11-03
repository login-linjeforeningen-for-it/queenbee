'use client'

import { Clock, Plus } from 'lucide-react'

export default function StatisticsNewAdditions({ additions }: { additions: GetStatisticsNewAdditionsProps }) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return `${diffDays} days ago`
        return date.toLocaleDateString()
    }

    return (
        <div className='pt-6 grow'>
            <h2 className='font-semibold text-lg pb-4'>Recent Additions</h2>
            <div className='flex flex-col gap-4'>
                {additions.slice(0, 10).map((addition) => (
                    <div key={addition.id} className='p-3 bg-white/5 rounded-md flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <Plus className='w-4 h-4 text-green-500' />
                            <div>
                                <div className='font-medium'>{addition.name_en} | {addition.source}</div>
                            </div>
                        </div>
                        <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                            <Clock className='w-3 h-3' />
                            {formatDate(addition.created_at)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}