import appConfig from '@config'
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(req: NextRequest) {
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
                return NextResponse.redirect(new URL('/api/logout', req.url))
            }
        }

        if (!validToken) {
            const response = await tokenIsValid(token)
            validToken = response.valid
            if (!validToken) {
                return NextResponse.redirect(new URL('/api/logout', req.url))
            }
        }

        if(req.nextUrl.pathname.startsWith('/internal')) {
            const response = await tokenIsValid(token)
            const groups = response.groups || []
            const lowerGroups = groups.map(g => g.toLowerCase())
            if (!lowerGroups.includes('tekkom')) {
                return NextResponse.redirect(new URL('/dashboard', req.url))
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
        path.startsWith('/api/login') ||
        path.startsWith('/api/callback') ||
        path.startsWith('/api/token') ||
        path.startsWith('/api/logout') ||
        path.startsWith('/api/authentik-health') ||
        path.startsWith('/_next/webpack-hmr')
    ) {
        return true
    }

    return false
}

async function tokenIsValid(token: string): Promise<{ valid: boolean; groups?: string[] }> {
    try {
        const userInfo = await fetch(appConfig.authentik.USERINFO_URL, {
            headers: { Authorization: `Bearer ${token}` },
        })

        if (!userInfo.ok) {
            return { valid: false}
        }

        const data = await userInfo.json()

        if (!Array.isArray(data.groups) || !data.groups.map((g: string) => g.toLowerCase()).includes('queenbee')) {
            return { valid: false}
        }

        return { valid: true, groups: data.groups }
    } catch (error) {
        console.log(`API Error (middleware.ts): ${error}`, {
            message: (error as Error).message,
            stack: (error as Error).stack,
        })

        return { valid: false}
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
