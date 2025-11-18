export default function formatAlert(input: unknown, fallback: string) {
    let message: string | null = null

    if (typeof input === 'string' && input.includes('{') && input.includes('}')) {
        return parse(input)
    }

    else if (typeof input === 'object' && input !== null) {
        if ('error' in input) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            message = String((input as any).error)
        }
    }

    return <h1>{message ?? fallback}</h1>
}

function parse(input: string) {
    if (typeof input !== 'string') {
        return input
    }

    if (!input.includes('{') || !input.includes('}')) {
        return input
    }

    try {
        const parsed = JSON.parse(input)

        if (typeof parsed === 'string') {
            return parse(parsed)
        }

        if (parsed && typeof parsed === 'object' && 'error' in parsed) {
            return `${parsed.error[0].toUpperCase()}${parsed.error.slice(1)}`
        }

        return parsed
    } catch {
        return input
    }
}
