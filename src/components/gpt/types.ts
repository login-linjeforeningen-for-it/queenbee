export type ChatSession = {
    clientName: string
    conversationId: string
    messages: GPT_ChatMessage[]
    isSending: boolean
    metrics: GPT_ModelMetrics
}

export type GptSocketMessage = {
    type?: string
    participants?: number
    client?: GPT_Client
    conversationId?: string
    clientName?: string | null
    delta?: string
    content?: string
    error?: string
    metrics?: GPT_ModelMetrics
}
