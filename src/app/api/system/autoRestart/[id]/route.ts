// import run from '@utils/db'
import { NextRequest } from 'next/server'

export async function GET(
    _req: NextRequest,
    context: RouteContext<'/api/system/autoRestart/[id]'>
) {
    const { id } = await context.params
    const value = await getAutoRestart(id)
    return Response.json({ ok: true, auto_restart: value })
}

async function getAutoRestart(id: string): Promise<boolean> {
    try {
        console.log(id)
        return true
        // const result = await run(
        //     'SELECT auto_restart FROM containers WHERE id = $1',
        //     [id]
        // )

        // if (result.rows.length === 0) {
        //     return false
        // }

        // return result.rows[0].auto_restart
    } catch (err) {
        console.error(err)
        return false
    }
}
