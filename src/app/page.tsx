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
            {typeof config.version !== 'undefined' ? (
                <Link
                    className={
                        'absolute right-4 bottom-4 bg-login-800 text-login-50 px-2 py-1 rounded-lg font-mono ' +
                        'border border-login-400 rounded-md text-white tracking-[0.05em] font-semibold text-lg '
                    }
                    target='_blank'
                    href={`${config.url.GITLAB_URL}/tekkom/web/beehive/queenbee/-/tags/${config.version}`}
                >
                    v{config.version}
                </Link>
            ) : null}
        </main>
    )
}
