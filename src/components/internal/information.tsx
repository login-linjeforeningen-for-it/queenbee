import { Star } from 'lucide-react'
import Link from 'next/link'

type InternalInfoProps = {
    information: InternalDashboardInformation
}

export default function InternalInfo({ information }: InternalInfoProps) {
    const primary = 'text-xs text-muted-foreground uppercase font-semibold'
    const secondary = 'text-sm font-medium'

    return (
        <div className='h-full'>
            <Link
                href='/internal/loadbalancing'
                className='flex flex-col justify-between h-full p-6 bg-login-50/5
                    rounded-xl border border-white/5 hover:bg-white/5 transition-colors'
            >
                <div className='flex items-center gap-3 pb-6'>
                    <div className='p-2 bg-emerald-500/10 rounded-lg'>
                        <Star className='w-5 h-5 text-emerald-500' />
                    </div>
                    <span className='font-medium'>Primary Site</span>
                </div>
                <div className='space-y-4'>
                    <div className='flex justify-between items-center border-b border-white/5 pb-2'>
                        <span className={primary}>ID</span>
                        <span className={secondary}>{information.primarySite.id}</span>
                    </div>
                    <div className='flex justify-between items-center border-b border-white/5 pb-2'>
                        <span className={primary}>IP</span>
                        <span className={secondary}>{information.primarySite.ip}</span>
                    </div>
                    <div className='flex justify-between items-center pt-1'>
                        <span className={primary}>Name</span>
                        <span className={secondary}>{information.primarySite.name}</span>
                    </div>
                </div>
            </Link>
        </div>
    )
}
