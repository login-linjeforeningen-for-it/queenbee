'use client'

import { useRouter, usePathname } from 'next/navigation'

export default function ViewToggle() {
    const router = useRouter()
    const pathname = usePathname()

    const view = pathname === '/internal/traffic/records' ? 'records' : 'metrics'

    return (
        <div className='inline-flex p-1'>
            <button
                onClick={() => router.push('/internal/traffic')}
                className={`bg-login-500 p-4 h-fit rounded-l-full text-sm font-medium transition-colors cursor-pointer ${
                    view === 'metrics'
                        ? 'bg-login/90! text-white'
                        : 'text-white hover:bg-login-400'
                }`}
            >
                Metrics
            </button>
            <button
                onClick={() => router.push('/internal/traffic/records')}
                className={`bg-login-500 p-4 h-fit rounded-r-full text-sm font-medium transition-colors cursor-pointer ${
                    view === 'records'
                        ? 'bg-login/90! text-white'
                        : 'text-white hover:bg-login-400'
                }`}
            >
                Records
            </button>
        </div>
    )
}