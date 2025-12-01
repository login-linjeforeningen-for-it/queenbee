import run from '@utils/db'

export default async function getAutoUpdate(id: string) {
    try {
        const result = await run(
            'SELECT auto_restart FROM containers WHERE id = $1',
            [id]
        )

        if (result.rows.length === 0) {
            return false
        }

        return result.rows[0].auto_restart
    } catch (err) {
        console.error(err)
        return false
    }
}
