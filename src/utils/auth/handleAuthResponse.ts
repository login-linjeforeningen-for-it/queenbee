import { setCookie } from "../cookies"

export default async function handleAuthResponse() {
    const url = window.location.href
    const query = new URLSearchParams(new URL(url).search)
    const userInfo = query.get("access_token")
    if (!userInfo) {
        return
    }

    const user = Object.fromEntries(query.entries())
    setCookie('access_token', user.access_token)
    setCookie('access_token_expires', user.access_token_expires)
    setCookie('refresh_token', user.refresh_token)
    setCookie('refresh_token_expires', user.refresh_token_expires)
    setCookie('user_id', user.user_id)
    setCookie('user_name', user.user_name)
    setCookie('user_roles', user.user_roles)

    const path = '/dashboard'
    window.location.href = path
}
