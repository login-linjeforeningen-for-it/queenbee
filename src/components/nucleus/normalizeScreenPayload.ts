export default function normalizeScreenPayload(screen: string) {
    const value = screen.trim()
    if (!value) {
        return {}
    }

    const lower = value.toLowerCase()
    if (lower.startsWith('event:')) {
        return { target: 'event', id: value.split(':')[1] || '' }
    }

    if (lower.startsWith('ad:')) {
        return { target: 'ad', id: value.split(':')[1] || '' }
    }

    if (lower.startsWith('menu:')) {
        return { target: 'menu', screen: value.split(':')[1] || 'NotificationScreen' }
    }

    if (lower === 'ai') {
        return { target: 'menu', screen: 'AiScreen' }
    }

    if (lower === 'admin') {
        return { target: 'menu', screen: 'AdminScreen' }
    }

    if (lower === 'login') {
        return { target: 'menu', screen: 'LoginScreen' }
    }

    return { target: 'menu', screen: 'NotificationScreen' }
}
