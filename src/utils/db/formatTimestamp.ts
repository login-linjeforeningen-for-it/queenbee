export default function formatTimestamp(timestamp: string) {
    return new Intl.DateTimeFormat('nb-NO', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Europe/Oslo',
    }).format(new Date(timestamp))
}
