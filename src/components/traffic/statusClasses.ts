export default function statusClasses(status: number) {
    // 5xx - Server Error (Critical/Rose)
    if (status >= 500) {
        return 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
    }

    // 4xx - Client Error (High/Amber)
    if (status >= 400) {
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
    }

    // 3xx - Redirection (Medium/Sky)
    if (status >= 300) {
        return 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
    }

    // 2xx - Success (Low/Emerald)
    return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
}
