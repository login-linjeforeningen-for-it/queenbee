// import { getEvent } from "@utils/api"

export default async function page({ params }: { params: Promise<{ ids: string[] }> }) {
    const { ids } = await params
    const id = ids[0]
    // const item = await getEvent(Number(id))

    return (
        <div className='h-[var(--h-pageInfo)]'>
            <h1 className="font-semibold text-lg">New event</h1>
        </div>
    )
}
