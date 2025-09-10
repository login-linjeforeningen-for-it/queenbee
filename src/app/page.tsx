import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Login from '@components/login/login'

export default async function Home() {
    const Cookies = await cookies()
    const token = Cookies.get('token')?.value
    if (token) {
        redirect('/dashboard')
    }

    return (
        <main className='h-full grid place-items-center p-4'>
            <div>
                <h1 className='text-2xl font-bold text-login text-center'>
                    QueenBee
                </h1>
                <p className='mt-2 text-foreground text-center font-semibold text-login-300'>Queenbee - Admintool</p>
                <Login />
            </div>
        </main>
    )
}
