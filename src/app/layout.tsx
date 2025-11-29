import type { Metadata } from 'next'
import './globals.css'
import 'uibee/styles'
import { cookies } from 'next/headers'
import Nav from '@/components/navbar/nav'
import { Toaster } from 'sonner'

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
                <header className='h-(--h-navbar)'>
                    <Nav />
                </header>
                <main className='flex flex-1 overflow-hidden'>
                    <div className='w-full bg-login-800'>{children}</div>
                </main>
                <Toaster
                    position='bottom-right'
                    style={
                        {
                            '--normal-bg': '#121212',
                            '--normal-text': 'white',
                            '--normal-border': '#6b6b6b',
                        } as React.CSSProperties
                    }
                />
            </body>
        </html>
    )
}
