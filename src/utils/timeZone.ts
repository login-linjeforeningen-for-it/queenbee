export function toLocalTimeString(date: string | undefined): string | undefined {
    if (typeof date !== 'string') return undefined

    const localDate = new Date(date)
    return localDate.toLocaleString('no-NO', {
        timeZone: 'Europe/Oslo',
        hour: '2-digit',
        minute: '2-digit'
    })
}
