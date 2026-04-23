// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function setExample(setFormValues: (_: any) => void) {
    setFormValues({
        title: 'Welcome to Nucleus 🚀',
        description: 'This is a test push notification',
        topic: 'example',
        screen: 'home',
    })
}
