import type { Metadata } from 'next'
import './globals.css'
import 'uibee/styles'
import { cookies } from 'next/headers'
import Nav from '@/components/navbar/nav'
import Sidebar from '@/components/sidebar/sidebar'
import { Toaster } from 'uibee/components'

export const metadata: Metadata = {
    title: 'QueenBee',
    description: 'Queenbee - Admintool',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const Cookies = await cookies()
    const theme = Cookies.get('theme')?.value || 'dark'

    return (
        <html test-id='root' lang='en' className={`${theme} h-full`}>
            <body className='bg-login-700 h-full flex flex-col'>
                <header className='h-(--h-navbar) md:hidden!'>
                    <Nav />
                </header>
                <div className='flex flex-1 overflow-hidden'>
                    <div className='hidden md:block! h-full shrink-0'>
                        <Sidebar />
                    </div>
                    <main className='flex-1 h-full bg-login-800 overflow-hidden relative'>
                        <div className='relative p-4 pt-10! w-full h-full bg-login-800 overflow-scroll'>
                            {children}
                        </div>
                    </main>
                </div>
                <Toaster />
            </body>
        </html>
    )
}
