export default function formatDate(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const dateDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const diffMs = nowDate.getTime() - dateDate.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
}
