import appConfig from '@config'
import { NextRequest, NextResponse } from 'next/server'
import { Agent, Dispatcher } from 'undici'

type FetchOptions = RequestInit & {
    dispatcher?: Dispatcher
}

export const config = {
    runtime: 'nodejs'
}

export async function middleware(req: NextRequest) {
    const tokenCookie = req.cookies.get('access_token')
    if (!pathIsAllowedWhileUnauthenticated(req.nextUrl.pathname)) {
        if (!tokenCookie) {
            return NextResponse.redirect(new URL('/', req.url))
        }
        const token = tokenCookie.value
        const validToken = await tokenIsValid(token)
        if (!validToken) {
            return NextResponse.redirect(new URL('/logout', req.url))
        }
    }
    const theme = req.cookies.get('theme')?.value || 'dark'
    const res = NextResponse.next()
    res.headers.set('x-theme', theme)
    return res
}

function pathIsAllowedWhileUnauthenticated(path: string) {
    if (path === '/' || path === '/favicon.ico') {
        return true
    }

    if (
        path.startsWith('/_next/static/')
        || path.startsWith('/_next/image')
        || path.startsWith('/images/')
        || path.startsWith('/login')
        || path.startsWith('/logout')
        || path.startsWith('/_next/webpack-hmr')
    ) {
        return true
    }

    return false
}

async function tokenIsValid(token: string): Promise<boolean> {
    try {
        const agent = new Agent({
            connect: {
                rejectUnauthorized: false
            }
        })

        const response = await fetch(`${appConfig.url.API_URL}/events`, {
            headers: { Authorization: `Bearer ${token}` },
            agent
        } as FetchOptions)

        if (!response.ok) {
            const errorDescription = `Failed connection to: ${appConfig.url.API_URL}/events: ${await response.text()}`
            console.error(errorDescription)
            return false
        }

        return true
    } catch (error) {
        console.error(`API Error (middleware.ts): ${error}`, {
            message: (error as Error).message,
            stack: (error as Error).stack
        })
        return false
    }
}
