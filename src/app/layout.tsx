import type { Metadata } from 'next'
import './globals.css'
import 'uibee/styles'
import { cookies } from 'next/headers'
import Nav from '@/components/navbar/nav'
import { Toaster } from 'uibee/components'
import getDocker from '@utils/api/internal/system/getDocker'
import worstAndBestServiceStatus from '@components/services/worstAndBestServiceStatus'

export const metadata: Metadata = {
    title: 'QueenBee',
    description: 'Queenbee - Admintool',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const Cookies = await cookies()
    const theme = Cookies.get('theme')?.value || 'dark'
    const docker = await getDocker()
    const { meta } = await worstAndBestServiceStatus('prod', true)

    return (
        <html test-id='root' lang='en' className={`${theme} h-full`}>
            <body className='bg-login-700 h-full flex flex-col'>
                <header className='h-(--h-navbar)'>
                    <Nav docker={docker} meta={meta} />
                </header>
                <main className='flex flex-1 overflow-hidden'>
                    <div className='w-full bg-login-800'>{children}</div>
                </main>
                <Toaster />
            </body>
        </html>
    )
}
