type FallbackDateProps =
    | string
    | {
        time?: string
        seconds?: number
        minutes?: number
        hours?: number
        days?: number
        months?: number
        years?: number
    }

export default function fallBackDate(props: FallbackDateProps): string {
    const d = new Date()
    const {
        time,
        seconds = 0,
        minutes = 0,
        hours = 0,
        days = 0,
        months = 0,
        years = 0,
    } = typeof props === 'string' ? { time: props } : props

    // Presets
    switch (time) {
        case 'three months':
            d.setMonth(d.getMonth() + 2)
            break
        case 'two months':
            d.setMonth(d.getMonth() + 2)
            break
        case 'one month':
            d.setMonth(d.getMonth() + 1)
            break
        case 'one year':
            d.setFullYear(d.getFullYear() + 1)
            break
        case 'tomorrow':
            d.setDate(d.getDate() + 1)
            break
        case 'till summer': {
            // Next June 21st
            const year =
                d.getMonth() < 5 ? d.getFullYear() : d.getFullYear() + 1
            d.setFullYear(year, 5, 21)
            d.setHours(0, 0, 0, 0)
            break
        }
        case 'eoy': {
            // December 31st of this year
            d.setFullYear(d.getFullYear(), 11, 31)
            d.setHours(23, 59, 59, 999)
            break
        }
    }

    // Numeric offsets
    if (seconds) d.setSeconds(d.getSeconds() + seconds)
    if (minutes) d.setMinutes(d.getMinutes() + minutes)
    if (hours) d.setHours(d.getHours() + hours)
    if (days) d.setDate(d.getDate() + days)
    if (months) d.setMonth(d.getMonth() + months)
    if (years) d.setFullYear(d.getFullYear() + years)

    return d.toISOString()
}
