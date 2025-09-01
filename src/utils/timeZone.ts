export function timeZoneOffset(): string {
    process.env.TZ = 'Europe/Oslo'

    const timezoneOffset = new Date().getTimezoneOffset()
    const symbol = timezoneOffset > 0 ? '-' : '+'
    const offset = Math.abs(timezoneOffset / 60)

    return `${symbol}${offset.toString().padStart(2, '0')}:00`
}

export function toLocalTimeString(date: string | undefined): string | undefined {
    if (typeof date !== 'string') return undefined

    const localDate = new Date(date)
    return localDate.toLocaleString('no-NO', {
        timeZone: 'Europe/Oslo',
        hour: '2-digit',
        minute: '2-digit'
    })
}

