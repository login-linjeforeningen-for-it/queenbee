import DateInput from '@components/inputs/date'
import Input from '@components/inputs/input'
import Markdown from '@components/inputs/markdown'
import Select from '@components/inputs/select'
import Switch from '@components/inputs/switch'
import TimeInput from '@components/inputs/time'
import { getAudiences, getCategories, getEventBannerImages, getEventSmallImages, getJobImages, getLocations, getOrganizationImages, getOrganizations, getRules } from '@utils/api'

export async function EventFormInputs({ defaultValues }: { defaultValues?: GetEventProps }) {
    const bannerImagesResponse = await getEventBannerImages()
    const bannerImages = Array.isArray(bannerImagesResponse)
        ? bannerImagesResponse.map((image) => ({
            label: image.name,
            value: image.name,
            image: `${image.filepath}${image.name}`,
        }))
        : []

    const smallImagesResponse = await getEventSmallImages()
    const smallImages = Array.isArray(smallImagesResponse)
        ? smallImagesResponse.map((image) => ({
            label: image.name,
            value: image.name,
            image: `${image.filepath}${image.name}`,
        }))
        : []

    const categoriesResponse = await getCategories()
    const categories = Array.isArray(categoriesResponse)
        ? categoriesResponse.map((category) => ({
            label: category.name_en,
            value: category.id,
        }))
        : []

    const organizationsResponse = await getOrganizations()
    const organizations = Array.isArray(organizationsResponse)
        ? organizationsResponse.map((organization) => ({
            label: organization.name_en,
            value: organization.shortname,
        }))
        : []

    const rulesResponse = await getRules()
    const rules = Array.isArray(rulesResponse)
        ? rulesResponse.map((rule) => ({
            label: rule.name_en,
            value: rule.id,
        }))
        : []

    const locationsResponse = await getLocations()
    const locations = Array.isArray(locationsResponse)
        ? locationsResponse.map((location) => ({
            label: location.name_en,
            value: location.id,
        }))
        : []

    const audiencesResponse = await getAudiences()
    const audiences = Array.isArray(audiencesResponse)
        ? audiencesResponse.map((audience) => ({
            label: audience.name_en,
            value: audience.id,
        }))
        : []

    const timeTypes: { label: string; value: time_type }[] = [
        { label: 'Default', value: 'default' },
        { label: 'No end', value: 'no_end' },
        { label: 'Whole day', value: 'whole_day' },
        { label: 'To Be Determined', value: 'tbd' },
    ]

    return (
        <div className='flex flex-col gap-12'>
            <div className='flex flex-col gap-4'>
                <div className='grid grid-cols-2 gap-x-8 gap-y-4 justify-between w-full'>
                    <Input name='name_no' type='text' label='Name (Norwegian)' defaultValue={defaultValues?.event.name_no} required />
                    <Input name='name_en' type='text' label='Name (English)' defaultValue={defaultValues?.event.name_en} required />
                    <Input name='informational_no' type='text' label='Informational (Norwegian)' defaultValue={defaultValues?.event.informational_no} />
                    <Input name='informational_en' type='text' label='Informational (English)' defaultValue={defaultValues?.event.informational_en} />
                    <Markdown name='description_no' label='Description (Norwegian)' defaultValue={defaultValues?.event.description_no} required />
                    <Markdown name='description_en' label='Description (English)' defaultValue={defaultValues?.event.description_en} required />
                </div>
            </div>
            <div className='flex flex-row gap-8'>
                <div className='flex flex-col gap-4 w-full'>
                    <Select name='category' label='Category' options={categories} defaultValue={defaultValues?.event.category} required />
                    <Select name='organization' label='Organization' options={organizations} defaultValue={Array.isArray(defaultValues?.organizations) && defaultValues.organizations.length > 0 ? defaultValues.organizations[0].shortname : undefined} />
                    <Select name='rule' label='Rule' options={rules} defaultValue={defaultValues?.event.rule} />
                    <Select name='location' label='Location' options={locations} defaultValue={defaultValues?.event.location} />
                    <Select name='audiences' label='Audiences' options={audiences} defaultValue={Array.isArray(defaultValues?.audiences) && defaultValues.audiences.length > 0 ? defaultValues.audiences[0].id : undefined} />
                </div>
                <div className='flex flex-col gap-4 w-full'>
                    <Select name='time_type' label='Time Type' options={timeTypes} defaultValue={defaultValues?.event.time_type} required />
                    {/* Date and time inputs based on different timeType */}
                    <div className='flex flex-row gap-4 w-full'>
                        <div className='flex flex-col gap-4 w-full'>
                            <DateInput name='start_date' label='Start Date' defaultValue={defaultValues?.event.time_start.split('T')[0]} required />
                            <DateInput name='end_date' label='End Date' defaultValue={defaultValues?.event.time_end.split('T')[0]} required />
                            <DateInput name='publish_date' label='Publish Date' defaultValue={defaultValues?.event.time_publish.split('T')[0]} required />
                        </div>
                        <div className='flex flex-col gap-4 w-full'>
                            <TimeInput name='start_time' label='Start Time' defaultValue={defaultValues?.event.time_start.split('T')[1].split('Z')[0]} required />
                            <TimeInput name='end_time' label='End Time' defaultValue={defaultValues?.event.time_end.split('T')[1].split('Z')[0]} required />
                            <TimeInput name='publish_time' label='Publish Time' defaultValue={defaultValues?.event.time_publish.split('T')[1].split('Z')[0]} required />
                        </div>
                    </div>
                    <Switch name='highlight' label='Highlight' defaultValue={defaultValues?.event.highlight} />
                </div>
            </div>
            
            <div className='flex flex-col gap-4'>
                <h1 className='text-xl'>Signup</h1>
                <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
                    <Input name='link_signup' type='text' label='Signup Link' defaultValue={defaultValues?.event.link_signup} />
                    <div className='grid grid-cols-2 gap-x-4 gap-y-4'>
                        <DateInput name='release_date' label='Release Date' defaultValue={defaultValues?.event.time_signup_release.split('T')[0]} />
                        <TimeInput name='release_time' label='Release Time' defaultValue={defaultValues?.event.time_signup_release.split('T')[1].split('Z')[0]} />
                    </div>
                    <Input name='capacity' type='number' label='Capacity' defaultValue={defaultValues?.event.capacity} />
                    <div className='grid grid-cols-2 gap-x-4 gap-y-4'>
                        <DateInput name='deadline_date' label='Deadline Date' defaultValue={defaultValues?.event.time_signup_deadline.split('T')[0]} />
                        <TimeInput name='deadline_time' label='Deadline Time' defaultValue={defaultValues?.event.time_signup_deadline.split('T')[1].split('Z')[0]} />
                    </div>
                    <Switch name='isFull' label='Is Full' defaultValue={defaultValues?.event.full} />
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <h1 className='text-xl'>Image</h1>
                <Select name='image_banner' label='Banner Image' options={bannerImages} defaultValue={defaultValues?.event.image_banner} />
                <Select name='image_small' label='Small Image' options={smallImages} defaultValue={defaultValues?.event.image_small} />
            </div>
            <div className='flex flex-col gap-4'>
                <h1 className='text-xl'>Social Links</h1>
                <Input name='link_facebook' type='text' label='Facebook Link' defaultValue={defaultValues?.event.link_facebook} />
                <Input name='link_discord' type='text' label='Discord Link' defaultValue={defaultValues?.event.link_discord} />
                <Input name='link_stream' type='text' label='Stream Link' defaultValue={defaultValues?.event.link_stream} />
            </div>
        </div>
    )
}

export async function JobFormInputs({ defaultValues }: { defaultValues?: GetJobProps }) {
    const organizationsResponse = await getOrganizations()
    const organizations = Array.isArray(organizationsResponse)
        ? organizationsResponse.map((organization) => ({
            label: organization.name_en,
            value: organization.shortname,
        }))
        : []

    const applicationTypes: { label: string; value: job_type }[] = [
        { label: 'Full-time', value: 'full' },
        { label: 'Part-time', value: 'part' },
        { label: 'Summer', value: 'summer' },
        { label: 'Verv', value: 'verv' },
    ]

    const jobImagesResponse = await getJobImages()
    const jobImages = Array.isArray(jobImagesResponse)
        ? jobImagesResponse.map((image) => ({
            label: image.name,
            value: image.name,
            image: `${image.filepath}${image.name}`,
        }))
        : []

    return (
        <div className='flex flex-col gap-12'>
            <div className='flex flex-col gap-8'>
                <div className='grid grid-cols-2 gap-x-8 gap-y-4 justify-between w-full'>
                    <Input name='title_no' type='text' label='Title (Norwegian)' defaultValue={defaultValues?.title_no} required />
                    <Input name='title_en' type='text' label='Title (English)' defaultValue={defaultValues?.title_en} required />
                    <Input name='position_title_no' type='text' label='Position (Norwegian)' defaultValue={defaultValues?.position_title_no} required />
                    <Input name='position_title_en' type='text' label='Position (English)' defaultValue={defaultValues?.position_title_en} required />
                    <Input name='description_short_no' type='text' label='Short Description (Norwegian)' defaultValue={defaultValues?.description_short_no} required />
                    <Input name='description_short_en' type='text' label='Short Description (English)' defaultValue={defaultValues?.description_short_en} required />
                    <Markdown name='description_long_no' label='Description (Norwegian)' defaultValue={defaultValues?.description_long_no} required />
                    <Markdown name='description_long_en' label='Description (English)' defaultValue={defaultValues?.description_long_en} required />
                </div>
                <div className='grid grid-cols-2 gap-x-8 gap-y-4 justify-between w-full'>
                    <Select name='organization' label='Organization' options={organizations} defaultValue={defaultValues?.organization} required />
                    <Input name='cities' type='text' label='Cities' />
                    <Select name='job_type' label='Application Type' options={applicationTypes} defaultValue={defaultValues?.job_type} required />
                    <Input name='skills' type='text' label='Skills' />
                    <div className='grid grid-cols-2 gap-x-4 gap-y-4 w-full'>
                        <DateInput name='publish_date' label='Publish Date' defaultValue={defaultValues?.time_publish.split('T')[0]} required />
                        <TimeInput name='publish_time' label='Publish Time' defaultValue={defaultValues?.time_publish.split('T')[1].split('Z')[0]} required />
                    </div>
                    <Switch name='highlight' label='Highlight Ad' defaultValue={defaultValues?.highlight} />
                    <div className='grid grid-cols-2 gap-x-4 gap-y-4 w-full'>
                        <DateInput name='expire_date' label='Expire Date' defaultValue={defaultValues?.time_expire.split('T')[0]} required />
                        <TimeInput name='expire_time' label='Expire Time' defaultValue={defaultValues?.time_expire.split('T')[1].split('Z')[0]} required />
                    </div>
                    
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <h1 className='text-xl'>Application</h1>
                <Input name='application_url' type='text' label='Application URL' defaultValue={defaultValues?.application_url} required />
                <div className='flex flex-row gap-4'>
                    <DateInput name='deadline_date' label='Deadline Date' defaultValue={defaultValues?.application_deadline.split('T')[0]} required />
                    <TimeInput name='deadline_time' label='Deadline Time' defaultValue={defaultValues?.application_deadline.split('T')[1].split('Z')[0]} required />
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <h1 className='text-xl'>Image</h1>
                <Select name='banner_image' label='Banner Image' options={jobImages} defaultValue={defaultValues?.banner_image} required />
            </div>
        </div>
    )
}

export async function OrganizationFormInputs({ defaultValues }: { defaultValues?: GetOrganizationProps }) {
    const imagesResponse = await getOrganizationImages()
    const images = Array.isArray(imagesResponse)
        ? imagesResponse.map((image) => ({
            label: image.name,
            value: image.name,
            image: `${image.filepath}${image.name}`,
        }))
        : []

    return (
        <div className='flex flex-col gap-12'>
            <div className='flex flex-col gap-4'>
                <Input name='shortname' type='text' label='Short Name' defaultValue={defaultValues?.shortname} required />
                <div className='grid grid-cols-2 gap-y-4 gap-x-8  w-full'>
                    <Input name='name_no' type='text' label='Name (Norwegian)' defaultValue={defaultValues?.name_no} required />
                    <Input name='name_en' type='text' label='Name (English)' defaultValue={defaultValues?.name_en} required />
                    <Markdown name='description_no' label='Description (Norwegian)' defaultValue={defaultValues?.description_no} required />
                    <Markdown name='description_en' label='Description (English)' defaultValue={defaultValues?.description_en} required />
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <h1 className='text-xl'>Social Links</h1>
                <Input name='link_homepage' type='text' label='Homepage Link' defaultValue={defaultValues?.link_homepage} required />
                <Input name='link_linkedin' type='text' label='Linkedin Link' defaultValue={defaultValues?.link_linkedin} />
                <Input name='link_facebook' type='text' label='Facebook Link' defaultValue={defaultValues?.link_facebook} />
                <Input name='link_instagram' type='text' label='Instagram Link' defaultValue={defaultValues?.link_instagram} />
            </div>
            <div className='flex flex-col gap-4'>
                <h1 className='text-xl'>Logo</h1>
                <Select name='logo' label='Organization Logo' options={images} defaultValue={defaultValues?.logo} required />
            </div>
        </div>
    )
}

export function LocationFormInputs({ defaultValues }: { defaultValues?: GetLocationProps }) {
    return (
        <div className='flex flex-col gap-4'>
            <Input name='name_no' type='text' label='Name (Norwegian)' defaultValue={defaultValues?.name_no} required />
            <Input name='name_en' type='text' label='Name (English)' defaultValue={defaultValues?.name_en} required />
            <Input name='url' type='text' label='URL' defaultValue={defaultValues?.url} />
            {/* Location Select with different options */}
        </div>
    )
}

export function RuleFormInputs({ defaultValues }: { defaultValues?: GetRuleProps }) {
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-row gap-8 justify-between w-full'>
                <Input name='name_no' type='text' label='Name (Norwegian)' required defaultValue={defaultValues?.name_no} />
                <Input name='name_en' type='text' label='Name (English)' required defaultValue={defaultValues?.name_en} />
            </div>
            <div className='flex flex-row gap-8 justify-between w-full'>
                <Markdown name='description_no' label='Description (Norwegian)' required defaultValue={defaultValues?.description_no} />
                <Markdown name='description_en' label='Description (English)' required defaultValue={defaultValues?.description_en} />
            </div>
        </div>
    )
}