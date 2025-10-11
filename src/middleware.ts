import appConfig from '@config'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
    runtime: 'nodejs',
}

export async function middleware(req: NextRequest) {
    const tokenCookie = req.cookies.get('access_token')
    let validToken = false

    if (!pathIsAllowedWhileUnauthorized(req.nextUrl.pathname)) {
        if (!tokenCookie) {
            return NextResponse.redirect(new URL('/', req.url))
        }

        const btgCookie = req.cookies.get('btg_name')
        const btg = btgCookie?.value
        const token = tokenCookie.value

        if (btg) {
            validToken = await btgTokenIsValid(token, btg)
            if (!validToken) {
                return NextResponse.redirect(new URL('/logout', req.url))
            }
        }

        if (!validToken) {
            validToken = await tokenIsValid(token)
            if (!validToken) {
                return NextResponse.redirect(new URL('/logout', req.url))
            }
        }
    }

    const theme = req.cookies.get('theme')?.value || 'dark'
    const res = NextResponse.next()
    res.headers.set('x-theme', theme)
    return res
}

function pathIsAllowedWhileUnauthorized(path: string) {
    if (path === '/' || path === '/favicon.ico') {
        return true
    }

    if (
        path.startsWith('/_next/static/') ||
        path.startsWith('/_next/image') ||
        path.startsWith('/images/') ||
        path.startsWith('/login') ||
        path.startsWith('/logout') ||
        path.startsWith('/api/authentik-health') ||
        path.startsWith('/_next/webpack-hmr')
    ) {
        return true
    }

    return false
}

async function tokenIsValid(token: string): Promise<boolean> {
    try {
        const response = await fetch(`${appConfig.url.API_URL}/events`, {
            headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
            const errorDescription =
                'Failed connection to: ' +
                `${appConfig.url.API_URL}/events: ${await response.text()}`
            console.log(errorDescription)
            return false
        }

        return true
    } catch (error) {
        console.log(`API Error (middleware.ts): ${error}`, {
            message: (error as Error).message,
            stack: (error as Error).stack,
        })

        return false
    }
}

async function btgTokenIsValid(token: string, name: string): Promise<boolean> {
    try {
        const response = await fetch(`${appConfig.url.TEKKOM_BOT_API_URL}/token`, {
            headers: {
                Authorization: `Bearer ${token}`,
                name,
                btg: 'queenbee-btg',
                middleware: 'true'
            }
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        return true
    } catch (error) {
        console.log(`API BTG Error (middleware.ts): ${error}`, {
            message: (error as Error).message,
            stack: (error as Error).stack,
        })

        return false
    }
}