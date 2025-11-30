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
    if (!topic) {
        topic = 'maintenance'
    }

    const data: Data = screen && screen.id ? screen : {}
    const message: object = {
        topic: topic,
        notification: {
            title: title,
            body: description,
        },
        data,
    }

    try {
        console.log(message)
        // const notification = await getMessaging().send(message)

        // if (notification) {
        //     return true
        // }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return false
    }

    return false
}

// Examples of direct notifications that can be sent by node sendNotifications.ts
// Topics: norwegianTOPIC, englishTOPIC, ...

// sendNotification({title: 'Tittel', description: 'Beskrivelse', topic: 'maintenance'})
