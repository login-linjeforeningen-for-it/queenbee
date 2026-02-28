export default function formatNextBackup(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()

    if (isNaN(date.getTime())) return 'Invalid date'

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const timeStr = `${hours}:${minutes}`

    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const dateDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const diffMs = dateDate.getTime() - nowDate.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays < 7) {
        let dayStr: string
        if (diffDays <= 0) dayStr = 'Today'
        else if (diffDays === 1) dayStr = 'Tomorrow'
        else dayStr = `in ${diffDays} days`
        return `${dayStr} at ${timeStr}`
    } else {
        const day = date.getDate()
        const monthNames = [
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'
        ]
        const month = monthNames[date.getMonth()]
        return `${day}. ${month} at ${timeStr}`
    }
}
