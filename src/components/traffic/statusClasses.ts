export default function statusClasses(status: number) {
    if (status >= 500) {
        return 'bg-red-500/20 text-red-400 border-red-500/20'
    }

    if (status >= 400) {
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20'
    }

    if (status >= 300) {
        return 'bg-sky-500/20 text-sky-400 border-sky-500/20'
    }

    return 'bg-green-500/20 text-green-400 border-green-500/20'
}
