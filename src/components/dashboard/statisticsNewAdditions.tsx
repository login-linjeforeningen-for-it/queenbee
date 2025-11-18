'use client'

import { Clock, Plus, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function StatisticsNewAdditions({ additions }: { additions: GetStatisticsNewAdditionsProps }) {
    function formatDate(dateString: string) {
        const date = new Date(dateString)
        const now = new Date()
        const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const dateDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        const diffMs = nowDate.getTime() - dateDate.getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return `${diffDays} days ago`
        return date.toLocaleDateString()
    }

    return (
        <div className='grow flex flex-col'>
            <h2 className='pt-6 pb-4 text-center font-semibold text-lg shrink-0'>Recent Additions</h2>
            <div className='flex flex-col gap-2 flex-1 overflow-hidden'>
                {additions.map((addition) => (
                    <Link
                        href={`/${addition.source}/update/${addition.id}`}
                        key={`${addition.id}-${addition.source}`}
                        className='p-3 bg-login-600 rounded-md flex items-center justify-between'
                    >
                        <div className='flex items-center justify-between gap-2'>
                            {
                                addition.action === 'created' ? (
                                    <Plus className='w-4 h-4 text-green-500' />
                                ) : (
                                    <RefreshCw className='w-4 h-4 text-login' />
                                )
                            }
                            <div>
                                <div className='font-medium'>{addition.name_en} | {addition.source}</div>
                            </div>
                        </div>
                        <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                            <Clock className='w-3 h-3' />
                            {formatDate(addition.updated_at)}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}