import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { LoginPage } from 'uibee/components'
import config from '@config'

export default async function Home() {
    const Cookies = await cookies()
    const token = Cookies.get('access_token')?.value
    if (token) {
        redirect('/dashboard')
    }

    const heads = await headers()
    const proto = heads.get('x-forwarded-proto') ?? 'https'
    const host = heads.get('x-forwarded-host') ?? heads.get('host') ?? 'localhost'
    const loginURL = `${proto}://${host}${config.auth.paths.login}`

    return <LoginPage
        title='Queenbee'
        description='Management System'
        redirectURL={loginURL}
        version={config.version}
    />
}
