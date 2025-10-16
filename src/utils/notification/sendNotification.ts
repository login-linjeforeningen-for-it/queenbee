import { ServiceAccount, initializeApp } from 'firebase-admin/app'
import admin from 'firebase-admin'
import { Message, getMessaging } from 'firebase-admin/messaging'
import config from '@config'

type sendNotificationProps = {
    title: string
    description: string
    screen?: DetailedEvent | EventWithOnlyID
    topic?: string
}

// A new type that is the same as DetailedEvent, but with id as a string
interface DetailedEventStr extends Omit<DetailedEvent, 'id'> {
    id: string
}

// Data in the message cannot be undefined so it is defined as an empty object or a DetailedEventStr
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Data = {} | DetailedEventStr

// Initialize the Firebase Admin SDK with the service account only if not already initialized and config is available
if (!admin.apps.length && config.firebase.project_id) {
    initializeApp({
        credential: admin.credential.cert({ ...config.firebase } as ServiceAccount),
    })
}

/**
 * Posts notification to FCM.
 * @param title    Notification title
 * @param body     Notification body
 * @param screen   Event to navigate to in the app, give the full object.
 * @param topic    Notification topic
 */
export default async function sendNotification({
    title,
    description,
    screen,
    topic,
}: sendNotificationProps): Promise<boolean> {
    // Sets the topic to maintenance if the topic is not available
    if (!topic) {
        topic = 'maintenance'
    }

    // Provide screen as data parameter if the id is defined
    const data: Data = screen && screen.id ? screen : {}

    // Defines the message to be sent
    const message: Message = {
        topic: topic,
        notification: {
            title: title,
            body: description,
        },
        data,
    }

    // Sends the message
    try {
        const notification = await getMessaging().send(message)

        if (notification) {
            return true
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return false
    }

    return false
}

// Examples of direct notifications that can be sent by node sendNotifications.ts
// Topics: norwegianTOPIC, englishTOPIC, ...

// sendNotification({title: 'Tittel', description: 'Beskrivelse', topic: 'maintenance'})
