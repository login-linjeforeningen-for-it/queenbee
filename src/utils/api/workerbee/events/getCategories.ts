'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getCategories(): Promise<GetCategoriesProps | string> {
    return await getWrapper({
        path: 'categories',
        service: 'workerbee'
    })
}
