export default function getStatusTone(status: string) {
    return status.toLowerCase().includes('up')
        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
        : 'border-red-500/20 bg-red-500/10 text-red-300'
}
