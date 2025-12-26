import FormWrapper from '@components/form/wrapper'
import AlbumFormInputs from '@components/form/server/albums'
import getAlbum from '@utils/api/albums/getAlbum'
import { createAlbum, updateAlbum } from '@components/form/actions/albums'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ slug: string; id?: string[] }>
}) {
    const { id, slug } = await params

    if (id) {
        const album = await getAlbum(Number(id[0]))
        if (typeof album === 'object' && Object.keys(album).length > 0) {
            if (slug === 'create') {
                return (
                    <FormWrapper
                        name='album'
                        path='albums'
                        type='create'
                        formAction={createAlbum}
                        customRedirect='images'
                    >
                        <AlbumFormInputs type='update' defaultValues={album} />
                    </FormWrapper>
                )
            } else if (slug === 'update') {
                return (
                    <FormWrapper
                        name='album'
                        path='albums'
                        type='update'
                        id={id[0]}
                        formAction={updateAlbum}
                    >
                        <AlbumFormInputs type='update' defaultValues={album} />
                    </FormWrapper>
                )
            }
        }
    } else if (slug === 'create') {
        return (
            <FormWrapper
                name='album'
                path='albums'
                type='create'
                formAction={createAlbum}
                customRedirect='images'
            >
                <AlbumFormInputs type='create' />
            </FormWrapper>
        )
    }

    notFound()
}
