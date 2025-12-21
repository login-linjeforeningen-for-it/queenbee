export default function barColor(state: Bar) {
    switch(state) {
        case 'up': return 'bg-green-400/80 outline-green-500'
        case 'down': return 'bg-red-400/80 outline-red-500'
        case 'pending': return 'bg-[#fd8738]/80 outline-[#fd8738]'
        case 'maintenance': return 'bg-purple-400/80 outline-purple-500'
    }
}
