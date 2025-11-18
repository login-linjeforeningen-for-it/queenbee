type WidthRule = {
    max: number
    divisor: number
}

// needs to also have height otherwise the divisor will be different for
// different sizes
const widthRules: WidthRule[] = [
    { max: 300, divisor: 1 },
    { max: 500, divisor: 2 },
    { max: 600, divisor: 1.85 },
    { max: 1400, divisor: 2.5 },
    { max: 1450, divisor: 2.65 },
    { max: 1500, divisor: 2.3 },
    { max: 2500, divisor: 4.15 },
    { max: Infinity, divisor: 6.35 },
]

export default function getWidth(imageWidth: number): number {
    const rule = widthRules.find(r => imageWidth <= r.max)
    if (!rule) {
        return imageWidth
    }

    return imageWidth / rule.divisor
}
