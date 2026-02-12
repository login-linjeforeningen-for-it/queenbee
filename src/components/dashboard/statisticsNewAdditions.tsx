'use client'

import { Clock, Plus, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function StatisticsNewAdditions({ additions }: { additions: GetStatisticsNewAdditionsProps }) {
    return (
        <div className='h-full max-h-96 lg:max-h-none lg:grow flex flex-col'>
            <h2 className='pt-6 pb-4 text-center font-semibold text-lg shrink-0'>Recent Additions</h2>
            <div className='flex-1 flex flex-col gap-2 overflow-y-auto'>
                {additions.map((addition, index) => (
                    <Link
                        href={`/${addition.source}/update/${addition.id}`}
                        key={index}
                        className='p-3 bg-login-50/5 rounded-md flex items-center justify-between'
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
                                <div className='font-medium'>
                                    <span>{addition.name_en}</span>
                                    <span className='px-2 text-login-300'>|</span>
                                    <span className='text-login-300'>{addition.source}</span>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center gap-1 text-sm text-login-300 min-w-fit pl-2'>
                            <Clock className='w-3 h-3' />
                            {addition.updated_at}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
