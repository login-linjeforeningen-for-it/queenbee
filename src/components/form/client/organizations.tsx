'use client'

import Input from '@components/inputs/input'
import Markdown from '@components/inputs/markdown'
import Select from '@components/inputs/select'
import Button from '@components/userInput/button'
import { useState } from 'react'

export default function OrganizationFormInputsClient({
    defaultValues,
    images,
    preview
}: {
    defaultValues?: GetOrganizationProps
    images: LoginImage[]
    preview?: boolean
}) {
    const [formValues, setFormValues] = useState({
        shortname: defaultValues?.shortname ?? '',
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

    const mt = preview ? '-mt-12' : '-mt-13'

    function example() {
        setFormValues(sampleOrganization)
    }

    return (
        <div className='flex flex-col gap-12 relative'>
            <div
                className={
                    `absolute flex flex-row gap-[1rem] w-full ${mt} ` +
                    'w-full justify-end'
                }
            >
                <Button
                    color='secondary'
                    text='Example'
                    icon='+'
                    onClick={example}
                />
            </div>
            <div className='flex flex-col gap-4'>
                <Input
                    name='shortname'
                    type='text'
                    label='Short Name'
                    value={formValues.shortname}
                    setValue={(input) =>
                        setFormValues({
                            ...formValues,
                            shortname: input as string,
                        })
                    }
                    required
                />
                <div className='grid grid-cols-2 gap-y-4 gap-x-8  w-full'>
                    <Input
                        name='name_no'
                        type='text'
                        label='Name (Norwegian)'
                        value={formValues.name_no}
                        setValue={(input) =>
                            setFormValues({
                                ...formValues,
                                name_no: input as string,
                            })
                        }
                        required
                    />
                    <Input
                        name='name_en'
                        type='text'
                        label='Name (English)'
                        value={formValues.name_en}
                        setValue={(input) =>
                            setFormValues({
                                ...formValues,
                                name_en: input as string,
                            })
                        }
                        required
                    />
                    <Markdown
                        name='description_no'
                        label='Description (Norwegian)'
                        value={formValues.description_no}
                        setValue={(input) =>
                            setFormValues({
                                ...formValues,
                                description_no: input as string,
                            })
                        }
                        required
                    />
                    <Markdown
                        name='description_en'
                        label='Description (English)'
                        value={formValues.description_en}
                        setValue={(input) =>
                            setFormValues({
                                ...formValues,
                                description_en: input as string,
                            })
                        }
                        required
                    />
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <h1 className='text-xl'>Social Links</h1>
                <Input
                    name='link_homepage'
                    type='text'
                    label='Homepage Link'
                    value={formValues.link_homepage}
                    setValue={(input) =>
                        setFormValues({
                            ...formValues,
                            link_homepage: input as string,
                        })
                    }
                    required
                />
                <Input
                    name='link_linkedin'
                    type='text'
                    label='Linkedin Link'
                    value={formValues.link_linkedin}
                    setValue={(input) =>
                        setFormValues({
                            ...formValues,
                            link_linkedin: input as string,
                        })
                    }
                />
                <Input
                    name='link_facebook'
                    type='text'
                    label='Facebook Link'
                    value={formValues.link_facebook}
                    setValue={(input) =>
                        setFormValues({
                            ...formValues,
                            link_facebook: input as string,
                        })
                    }
                />
                <Input
                    name='link_instagram'
                    type='text'
                    label='Instagram Link'
                    value={formValues.link_instagram}
                    setValue={(input) =>
                        setFormValues({
                            ...formValues,
                            link_instagram: input as string,
                        })
                    }
                />
            </div>
            <div className='flex flex-col gap-4'>
                <h1 className='text-xl'>Logo</h1>
                <Select
                    name='logo'
                    label='Organization Logo'
                    options={images}
                    value={formValues.logo}
                    setValue={(input) =>
                        setFormValues({
                            ...formValues,
                            logo: input as string,
                        })
                    }
                    required
                />
            </div>
        </div>
    )
}

const sampleOrganization = {
    shortname: 'Login',
    name_no: 'Login - Linjeforeningen for IT',
    name_en: 'Login - Student Organization for IT',
    description_no:
        '🎓 Login er linjeforeningen for IT- og teknologistudenter ' +
        `ved NTNU Gjøvik.  
- Arrangerer sosiale og faglige aktiviteter  
- Nettverksbygging med næringslivet  
- Støtte til studenter gjennom semesteret`,
    description_en:
        '🎓 Login is the student organization for IT and technology ' +
        `students at NTNU Gjøvik.  
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
