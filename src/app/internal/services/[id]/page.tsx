import getContainer from '@utils/api/internal/system/getContainer'
import PageClient from './pageClient'

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function page({ params }: PageProps) {
    const id = (await params).id
    const container = await getContainer(id)

    return <PageClient data={container} />
}
