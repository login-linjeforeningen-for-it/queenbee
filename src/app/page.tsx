import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {LoginPage } from 'uibee/components'
import config from '@config'

export default async function Home() {
    const Cookies = await cookies()
    const token = Cookies.get('access_token')?.value
    if (token) {
        redirect('/dashboard')
    }

    return (
        <LoginPage
            title='Queenbee'
            description='Content Management System'
            redirectURL={config.auth.LOGIN_URL}
            version={config.version}
        />
    )
}
