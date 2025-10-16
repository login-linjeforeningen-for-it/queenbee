import type { Metadata } from 'next'
import './globals.css'
import 'uibee/styles'
import { cookies } from 'next/headers'
import Nav from '@/components/navbar/nav'

export const metadata: Metadata = {
    title: 'QueenBee',
    description: 'Queenbee - Admintool',
}

export default async function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const Cookies = await cookies()
    const theme = Cookies.get('theme')?.value || 'dark'
    return (
        <html test-id='root' lang='en' className={`${theme} h-full`}>
            <body className='bg-login-700 h-full flex flex-col'>
                <header className='h-[var(--h-navbar)]'>
                    <Nav />
                </header>
                <main className='flex flex-1 overflow-hidden'>
                    <div className='w-full bg-login-800'>{children}</div>
                </main>
            </body>
        </html>
    )
}
