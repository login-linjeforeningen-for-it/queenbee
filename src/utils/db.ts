import pg from 'pg'
import config from '@config'

type SQLParamType = (string | number | null | boolean | string[] | Date)[]

const { beekeeper } = config
const { Pool } = pg
const pool = new Pool({
    user: beekeeper.DB_USER || 'beekeeper',
    host: beekeeper.DB_HOST,
    database: beekeeper.DB || 'beekeeper',
    password: beekeeper.DB_PASSWORD,
    port: Number(beekeeper.DB_PORT) || 5432,
    max: Number(beekeeper.DB_MAX_CONN) || 20,
    idleTimeoutMillis: Number(beekeeper.DB_IDLE_TIMEOUT_MS) || 5000,
    connectionTimeoutMillis: Number(beekeeper.DB_TIMEOUT_MS) || 3000,
    keepAlive: true
})

export default async function run(query: string, params?: SQLParamType) {
    while (true) {
        try {
            const client = await pool.connect()
            try {
                return await client.query(query, params ?? [])
            } finally {
                client.release()
            }
        } catch {
            console.log(`Pool currently unavailable, retrying in ${beekeeper.CACHE_TTL / 1000}s...`)
            await sleep(beekeeper.CACHE_TTL)
        }
    }
}

function sleep(ms: number) {
    return new Promise(res => setTimeout(res, ms))
}
