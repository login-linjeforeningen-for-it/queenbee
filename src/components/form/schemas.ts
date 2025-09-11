import z from 'zod'

export const time_type = z.enum(['default', 'no_end', 'whole_day', 'tbd'])
export const job_type = z.enum(['full', 'part', 'summer', 'verv'])
export const location_type = z.enum(['mazemap', 'coords', 'address', 'digital'])

export const postEventSchema = z.object({
    canceled: z.boolean(),
    capacity: z.number().optional(),
    category: z.number(),
    description_en: z.string().min(1),
    description_no: z.string().min(1),
    digital: z.boolean(),
    full: z.boolean(),
    highlight: z.boolean(),
    image_banner: z.string().optional(),
    image_small: z.string().optional(),
    informational_en: z.string().optional(),
    informational_no: z.string().optional(),
    link_discord: z.string().optional(),
    link_facebook: z.string().optional(),
    link_signup: z.string().optional(),
    link_stream: z.string().optional(),
    location: z.number().optional(),
    name_en: z.string().min(1),
    name_no: z.string().min(1),
    parent: z.number().optional(),
    rule: z.number().optional(),
    time_end: z.iso.datetime({ offset: true }),
    time_publish: z.iso.datetime({ offset: true }),
    time_signup_deadline: z.iso.datetime({ offset: true }).optional(),
    time_signup_release: z.iso.datetime({ offset: true }).optional(),
    time_start: z.iso.datetime({ offset: true }),
    time_type: time_type,
    visible: z.boolean(),
})

export const patchEventSchema = postEventSchema.extend({
    id: z.number(),
})

export const postJobSchema = z.object({
    application_deadline: z.iso.datetime({ offset: true }),
    application_url: z.string().min(1),
    banner_image: z.string().nullable(),
    description_long_en: z.string().min(1),
    description_long_no: z.string().min(1),
    description_short_en: z.string().min(1),
    description_short_no: z.string().min(1),
    highlight: z.boolean(),
    job_type: job_type,
    organization: z.string().min(1),
    position_title_en: z.string().min(1),
    position_title_no: z.string().min(1),
    time_expire: z.iso.datetime({ offset: true }),
    time_publish: z.iso.datetime({ offset: true }),
    title_en: z.string().min(1),
    title_no: z.string().min(1),
    visible: z.boolean(),
})

export const patchJobSchema = postJobSchema.extend({
    id: z.number(),
})

export const postOrganizationSchema = z.object({
    description_en: z.string().min(1),
    description_no: z.string().min(1),
    link_facebook: z.string().optional(),
    link_homepage: z.string().min(1),
    link_instagram: z.string().optional(),
    link_linkedin: z.string().optional(),
    logo: z.string().nullish(),
    name_en: z.string().min(1),
    name_no: z.string().min(1),
    shortname: z.string().min(1),
    type: z.number().optional(),
})

export const patchOrganizationSchema = postOrganizationSchema

export const postLocationSchema = z.object({
    address_postcode: z.number().optional(),
    address_street: z.string().optional().nullable(),
    city_name: z.string().min(1).optional().nullable(),
    coordinate_lat: z.number().min(-90).max(90).optional(),
    coordinate_long: z.number().min(-180).max(180).optional(),
    mazemap_campus_id: z.number().optional(),
    mazemap_poi_id: z.number().optional(),
    name_en: z.string().min(1),
    name_no: z.string().min(1),
    type: location_type,
    url: z.url().optional(),
})

export const patchLocationSchema = postLocationSchema.extend({
    id: z.number(),
})

export const postRuleSchema = z.object({
    description_en: z.string().min(1),
    description_no: z.string().min(1),
    name_en: z.string().min(1),
    name_no: z.string().min(1),
})

export const patchRuleSchema = postRuleSchema.extend({
    id: z.number(),
})

export const postAnnouncementSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    channel: z.string().min(1),
    roles: z.string().optional(),
    embed: z.boolean().optional(),
    color: z.string().optional(),
    interval: z.string().optional(),
    time: z.string().nullable().optional(),
})

export const putAnnouncementSchema = postAnnouncementSchema.extend({
    id: z.number(),
})
