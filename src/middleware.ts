import config from '@config'
import { NextRequest, NextResponse } from 'next/server'
import { Agent, Dispatcher } from "undici"

type FetchOptions = RequestInit & {
    dispatcher?: Dispatcher
}

export async function middleware(req: NextRequest) {
    const tokenCookie = req.cookies.get('access_token')
    if (!pathIsAllowedWhileUnauthenticated(req.nextUrl.pathname)) {
        if (!tokenCookie) {
            return NextResponse.redirect(new URL('/', req.url))
        }
        const token = tokenCookie.value
        const validToken = await tokenIsValid(req, token as unknown as string)
        if (!validToken && !pathIsAllowedWhileUnauthenticated(req.nextUrl.pathname)) {
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

async function tokenIsValid(req: NextRequest, token: string): Promise<boolean> {
    const agent = new Agent({
        connect: {
            rejectUnauthorized: false
        }
    })

    const response = await fetch(`${config.url.API_URL}/events`, {
        headers: { Authorization: `Bearer ${token}` },
        dispatcher: agent
    } as FetchOptions)

    if (!response.ok) {
        console.error('Failed connection to:', `${config.url.API_URL}/events`, await response.text())
        NextResponse.redirect(new URL('/logout', req.url))
        return false
    }

    return true
}
