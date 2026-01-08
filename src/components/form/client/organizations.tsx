'use client'

import Upload from '@components/inputs/upload'
import config from '@config'
import postImage from '@utils/api/workerbee/images/postImage'
import { useState } from 'react'
import { toast, Button, Input, Textarea, Select } from 'uibee/components'

export default function OrganizationFormInputsClient({ defaultValues, defaultImages }: {
    defaultValues?: GetOrganizationProps
    defaultImages: Option[]
}) {
    const [images, setImages] = useState<Option[]>(defaultImages)
    const [formValues, setFormValues] = useState({
        name_no: defaultValues?.name_no ?? '',
        name_en: defaultValues?.name_en ?? '',
        description_no: defaultValues?.description_no ?? '',
        description_en: defaultValues?.description_en ?? '',
        link_homepage: defaultValues?.link_homepage ?? '',
        link_linkedin: defaultValues?.link_linkedin ?? '',
        link_facebook: defaultValues?.link_facebook ?? '',
        link_instagram: defaultValues?.link_instagram ?? '',
        logo: defaultValues?.logo ?? '',
    })

    function example() {
        setFormValues(sampleOrganization)
    }

    return (
        <div className='grid grid-cols-2 gap-x-8 pt-10 relative'>
            <div className='absolute flex flex-row gap-4 w-full justify-end'>
                <Button
                    color='secondary'
                    text='Example'
                    icon='+'
                    onClick={example}
                />
            </div>
            <Input
                name='name_no'
                type='text'
                label='Name (Norwegian)'
                value={formValues.name_no}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        name_no: e.target.value,
                    })
                }
                required
            />
            <Input
                name='name_en'
                type='text'
                label='Name (English)'
                value={formValues.name_en}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        name_en: e.target.value,
                    })
                }
                required
            />
            <Textarea
                name='description_no'
                label='Description (Norwegian)'
                type='markdown'
                value={formValues.description_no}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        description_no: e.target.value,
                    })
                }
                required
            />
            <Textarea
                name='description_en'
                label='Description (English)'
                type='markdown'
                value={formValues.description_en}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        description_en: e.target.value,
                    })
                }
                required
            />
            <h1 className='text-xl pt-10 pb-4 col-span-2'>Social Links</h1>
            <Input
                name='link_homepage'
                type='text'
                label='Homepage Link'
                value={formValues.link_homepage}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        link_homepage: e.target.value,
                    })
                }
                className='col-span-2'
                required
            />
            <Input
                name='link_linkedin'
                type='text'
                label='Linkedin Link'
                value={formValues.link_linkedin}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        link_linkedin: e.target.value,
                    })
                }
                className='col-span-2'
            />
            <Input
                name='link_facebook'
                type='text'
                label='Facebook Link'
                value={formValues.link_facebook}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        link_facebook: e.target.value,
                    })
                }
                className='col-span-2'
            />
            <Input
                name='link_instagram'
                type='text'
                label='Instagram Link'
                value={formValues.link_instagram}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        link_instagram: e.target.value,
                    })
                }
                className='col-span-2'
            />
            <h1 className='text-xl pt-10 col-span-2'>Logo</h1>
            <Upload
                handleFile={async function (file: File): Promise<void> {
                    const result = await postImage('organizations', file)
                    if (typeof result === 'string') {
                        toast.error(result)
                    } else {
                        toast.success('Image uploaded successfully')
                        const existingImage = images.find(img => img.value === result.image)
                        if (!existingImage) {
                            setImages([
                                ...images,
                                {
                                    label: result.image,
                                    value: result.image,
                                    image: `${config.url.cdn}/img/organizations/${result.image}`,
                                }
                            ])
                        }
                    }
                }}
            />
            <Select
                name='logo'
                label='Organization Logo'
                options={images}
                value={formValues.logo}
                onChange={(value) =>
                    setFormValues({
                        ...formValues,
                        logo: String(value || ''),
                    })
                }
                className='col-span-2'
            />
        </div>
    )
}

const sampleOrganization = {
    shortname: 'Login',
    name_no: 'Login - Linjeforeningen for IT',
    name_en: 'Login - Student Organization for IT',
    description_no:
        `🎓 Login er linjeforeningen for IT- og teknologistudenter
        ved NTNU Gjøvik.  
- Arrangerer sosiale og faglige aktiviteter  
- Nettverksbygging med næringslivet  
- Støtte til studenter gjennom semesteret`,
    description_en:
        `🎓 Login is the student organization for IT and technology
        students at NTNU Gjøvik.  
- Organizes social and academic events  
- Networking opportunities with companies  
- Student support throughout the semester`,
    link_homepage: 'https://login.no/',
    link_linkedin:
        'https://www.linkedin.com/company/login-student-organization/',
    link_facebook: 'https://www.facebook.com/loginlinjeforeningen',
    link_instagram: 'https://www.instagram.com/loginlinjeforeningen/',
    logo: 'tekkom_32.png',
}
