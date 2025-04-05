type JobProps = {
    application_deadline: string
    application_url: string
    banner_image: string
    description_long_en: string
    description_long_no: string
    description_short_en: string
    description_short_no: string
    highlight: boolean
    job_type: string
    organization: string
    position_title_en: string
    position_title_no: string
    time_expire: string
    time_publish: string
    title_en: string
    title_no: string
    visible: boolean
}

type CityProps = {
    city: string
    id: number
}

type SkillProps = {
    id: number
    skill: string
}

type EventProps = {
    canceled: boolean
    capacity: number
    category: number
    description_en: string
    description_no: string
    digital: boolean
    full: boolean
    highlight: boolean
    image_banner: string
    image_small: string
    informational_en: string
    informational_no: string
    link_discord: string
    link_facebook: string
    link_signup: string
    link_stream: string
    location: number
    name_en: string
    name_no: string
    parent: number
    rule: number
    time_end: string
    time_publish: string
    time_signup_deadline: string
    time_signup_release: string
    time_start: string
    time_type: string
    visible: boolean
}

type AudienceProps = {
    audience: number
    event: number
}

type OrganizationEventProps = {
    event: number
    organization: string
}

type LocationProps = {
    address_postcode: number
    address_street: string
    city_name: string
    coordinate_lat: number
    coordinate_long: number
    mazemap_campus_id: number
    mazemap_poi_id: number
    name_en: string
    name_no: string
    type: string
    url: string
}

type OrganizationProps = {
    description_en: string
    description_no: string
    link_facebook: string
    link_homepage: string
    link_instagram: string
    link_linkedin: string
    logo: string
    name_en: string
    name_no: string
    shortname: string
    type: number
}

type RuleProps = {
    description_en: string
    description_no: string
    name_en: string
    name_no: string
}