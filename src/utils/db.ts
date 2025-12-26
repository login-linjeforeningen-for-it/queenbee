import pg from 'pg'
import config from '@config'

type SQLParamType = (string | number | null | boolean | string[] | Date)[]

const { beekeeper } = config
const { Pool } = pg
const pool = new Pool({
    user: beekeeper.db.user || 'beekeeper',
    host: beekeeper.db.host,
    database: beekeeper.db.base || 'beekeeper',
    password: beekeeper.db.password,
    port: Number(beekeeper.db.port) || 5432,
    max: Number(beekeeper.db.max) || 20,
    idleTimeoutMillis: Number(beekeeper.db.idle) || 5000,
    connectionTimeoutMillis: Number(beekeeper.db.timeout) || 3000,
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
            console.log(`Pool currently unavailable, retrying in ${beekeeper.cache.ttl / 1000}s...`)
            await sleep(beekeeper.cache.ttl)
        }
    }
}

function sleep(ms: number) {
    return new Promise(res => setTimeout(res, ms))
}
