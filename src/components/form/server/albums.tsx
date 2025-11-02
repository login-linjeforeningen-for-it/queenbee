import AlbumFormInputsClient from '../client/albums'

export default function AlbumFormInputs(
    { defaultValues, type, parent }:
    { defaultValues?: GetAlbumProps, type: 'create' | 'update', parent?: { preview?: boolean }})
{
    return <AlbumFormInputsClient
        defaultValues={defaultValues}
        preview={parent?.preview}
        type={type}
    />
}
