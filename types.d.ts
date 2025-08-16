type time_type = 'default' | 'no_end' | 'whole_day' | 'tbd'
type job_type = 'full' | 'part' | 'summer' | 'verv'
type location_type = 'mazemap' | 'coords' | 'address' | 'digital'

// Events
type PostEventProps = {
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
    time_type: time_type
    visible: boolean
}

type PatchEventProps = PostEventProps & {
    id: number
}

type GetAudienceProps = {
    id: number,
    is_deleted: boolean,
    name_en: string,
    name_no: string
}[]

type GetImageProps = {
    filepath: string,
    name: string,
    size: number
}[]

type GetCategoriesProps = {
    color: string,
    id: number,
    name_en: string,
    name_no: string
}[]

// Jobs
type PostJobProps = {
    application_deadline: string
    application_url: string
    banner_image: string
    description_long_en: string
    description_long_no: string
    description_short_en: string
    description_short_no: string
    highlight: boolean
    job_type: job_type
    organization: string
    position_title_en: string
    position_title_no: string
    time_expire: string
    time_publish: string
    title_en: string
    title_no: string
    visible: boolean
}

type PatchJobProps = PostJobProps & {
    id: number
}

// Organizations
type GetOrganizationProps = {
    is_deleted: boolean,
    link_homepage: string,
    logo: string,
    name_en: string,
    name_no: string,
    shortname: string,
    updated_at: string
}[]

type PostOrganizationProps = {
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

type PatchOrganizationProps = PostOrganizationProps

// Locations
type GetLocationsProps = {
    address_postcode: number,
    address_street: string,
    city_name: string,
    coordinate_lat: number,
    coordinate_long: number,
    created_at: string,
    deleted_at: string,
    id: number,
    is_deleted: boolean,
    mazemap_campus_id: number,
    mazemap_poi_id: number,
    name_en: string,
    name_no: string,
    type: location_type,
    updated_at: string,
    url: string
}[]

type PostLocationProps = {
  address_postcode: number
  address_street: string
  city_name: string
  coordinate_lat: number
  coordinate_long: number
  mazemap_campus_id: number
  mazemap_poi_id: number
  name_en: string
  name_no: string
  type: location_type
  url: string
}

type PatchLocationProps = PostLocationProps & {
  id: number
}

// Rules
type GetRuleProps = {
    id: number,
    is_deleted: boolean,
    name_en: string,
    name_no: string
}[]

type PostRuleProps = {
    description_en: string
    description_no: string
    name_en: string
    name_no: string
}

type PatchRuleProps = PostRuleProps & {
    id: number
}

// API Responses
type ErrorResponse = {
    error: string
    status: number
    type: string
}

type EventPostResponseProps  = ErrorResponse | PostEventProps
type EventPatchResponseProps = ErrorResponse | PatchEventProps

type CategoriesGetResponseProps = ErrorResponse | GetCategoriesProps
type AudienceGetResponseProps = ErrorResponse | GetAudienceProps

type JobPostResponseProps  = ErrorResponse | PostJobProps
type JobPatchResponseProps = ErrorResponse | PatchJobProps

type OrganizationGetResponseProps   = ErrorResponse | GetOrganizationProps
type OrganizationPostResponseProps  = ErrorResponse | PostOrganizationProps
type OrganizationPatchResponseProps = ErrorResponse | PatchOrganizationProps

type LocationGetResponseProps     = ErrorResponse | GetLocationsProps
type LocationPostResponseProps    = ErrorResponse | PostLocationProps
type LocationPatchResponseProps   = ErrorResponse | PatchLocationProps

type RuleGetResponseProps   = ErrorResponse | GetRuleProps
type RulePostResponseProps  = ErrorResponse | PostRuleProps
type RulePatchResponseProps = ErrorResponse | PatchRuleProps

type ImageGetResponseProps = ErrorResponse | GetImageProps

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

type EventWithOnlyID = {
    id: string
}

type DetailedEvent = {
    id: number | string
    visible: boolean
    name_no: string
    name_en: string
    description_no: string
    description_en: string
    informational_no: string
    informational_en: string
    time_type: string
    time_start: string
    time_end: string
    time_publish: string
    time_signup_release: string
    time_signup_deadline: string
    canceled: boolean
    digital: boolean
    highlight: boolean
    image_small: string
    image_banner: string
    link_facebook: string
    link_discord: string
    link_signup: string
    link_stream: string
    capacity: number | null
    full: boolean
    category: number
    location: null
    parent: null
    rule: null
    updated_at: string
    created_at: string
    deleted_at: string
    category_name_no: string
    category_name_en: string
}

type SendResponseClient = {
    status: number
    message: string
}

type User = {
    access_token: string
    access_token_expires: string
    refresh_token: string
    refresh_token_expires: string
    user_id: string
    user_name: string
    user_roles: string
}
