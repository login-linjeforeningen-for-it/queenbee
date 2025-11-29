import smallDate from './smallDate'

export default function smartDate(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const dateDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const diffMs = nowDate.getTime() - dateDate.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
        return smallDate(dateString)
    }

    if (diffDays === 1) {
        return `Yesterday (${smallDate(dateString, true)})`
    }

    if (diffDays < 7) {
        return `${diffDays} days ago (${smallDate(dateString, 'noYear')})`
    }

    return smallDate(dateString)
}
