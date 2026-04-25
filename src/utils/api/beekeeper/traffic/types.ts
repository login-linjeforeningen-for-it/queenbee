export type TrafficRecord = {
    id: number
    timestamp: string
    method: string
    path: string
    domain: string
    country_iso?: string
    status: number
    request_time: number
    user_agent?: string
    referer?: string
}

export type TrafficRecordsProps = {
    result: TrafficRecord[]
    total: number
}

export type TrafficEntry = {
    key: string
    count?: number
    avg_time?: number
}

export type TrafficMetricsProps = {
    total_requests: number
    error_count: number
    avg_response_time: number
    avg_request_time?: number
    error_rate: number
    top_methods: TrafficEntry[]
    top_status_codes: TrafficEntry[]
    top_domains: TrafficEntry[]
    top_os: TrafficEntry[]
    top_browsers: TrafficEntry[]
    top_paths: TrafficEntry[]
    top_slow_paths: TrafficEntry[]
    top_error_paths: TrafficEntry[]
    requests_over_time: { key: string; count: number }[]
}
