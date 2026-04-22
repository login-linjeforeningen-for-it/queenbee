export default function formatDuration(seconds: number | null) {
    if (seconds === null || !Number.isFinite(seconds)) {
        return 'No data'
    }

    if (seconds < 1) {
        return '<1s'
    }

    if (seconds < 60) {
        return `${Math.round(seconds)}s`
    }

    if (seconds < 3600) {
        return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`
    }

    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
}
