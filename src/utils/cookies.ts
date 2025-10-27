export function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null
    const matches = document.cookie.match(
        new RegExp(
            '(?:^|; )' +
                name.replace(/([.$?*|{}()[\]/\\+^])/g, '\\$1') +
                '=([^;]*)'
        )
    )
    return matches ? decodeURIComponent(matches[1]) : null
}

export function setCookie(name: string, value: string, days?: number) {
    if (typeof document === 'undefined') return
    let expires = ''

    if (!value) {
        return
    }

    if (days) {
        const date = new Date()
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
        expires = `expires=${date.toUTCString()};`
    }

    document.cookie =
        `${name}=${encodeURIComponent(value)}; ` +
        `${expires} path=/; SameSite=Lax`
}

export function removeCookie(name: string) {
    if (typeof document === 'undefined') return
    document.cookie =
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ` +
        'path=/; SameSite=Lax'
}

export function removeCookies(...cookies: string[]) {
    for (const cookie of cookies) {
        removeCookie(cookie)
    }
}
