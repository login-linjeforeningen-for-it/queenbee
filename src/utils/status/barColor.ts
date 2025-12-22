export default function barColor(state: Bar, maxConsecutiveFailures: number) {
    const bar = state.status ? 'up' : state.expectedDown ? 'maintenance' : maxConsecutiveFailures > 0 ? 'pending' : 'down'
    switch(bar) {
        case 'up': return 'bg-green-400/80 outline-green-500'
        case 'down': return 'bg-red-400/80 outline-red-500'
        case 'pending': return 'bg-[#fd8738]/80 outline-[#fd8738]'
        case 'maintenance': return 'bg-purple-400/80 outline-purple-500'
    }
}

export function barOutlineColor(state: Bar, maxConsecutiveFailures: number) {
    const bar = state.status ? 'up' : state.expectedDown ? 'maintenance' : maxConsecutiveFailures > 0 ? 'pending' : 'down'
    switch(bar) {
        case 'up': return 'bg-green-400/50 outline-green-500'
        case 'down': return 'bg-red-400/50 outline-red-500'
        case 'pending': return 'bg-[#fd8738]/50 outline-[#fd8738]'
        case 'maintenance': return 'bg-purple-400/50 outline-purple-500'
    }
}

