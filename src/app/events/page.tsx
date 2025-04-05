import List from "@components/list/list"

export default function page() {
    const list = [{"id":368,"name_no":"Tekkom samling","name_en":"Tekkom gathering","highlight":false,"canceled":false,"full":false,"time_type":"default","time_start":"2025-04-08T18:00:00+02:00","time_end":"2025-04-08T22:00:00+02:00","time_publish":"2025-03-11T14:18:00+01:00","image_small":"","location_name_no":"Login Lounge (A155)","location_name_en":"","category_color":"#a206c9","category_name_no":"TekKom"},{"id":377,"name_no":"S2G CTF","name_en":"","highlight":false,"canceled":false,"full":false,"time_type":"default","time_start":"2025-04-09T16:00:00+02:00","time_end":"2025-04-09T21:00:00+02:00","time_publish":"0001-01-01T00:00:00Z","image_small":"","location_name_no":"Norwegian Cyber Range","location_name_en":"","category_color":"#2da62b","category_name_no":"CTF"},{"id":378,"name_no":"S2G CTF","name_en":"","highlight":false,"canceled":false,"full":false,"time_type":"default","time_start":"2025-04-09T16:00:00+02:00","time_end":"2025-04-09T21:00:00+02:00","time_publish":"0001-01-01T00:00:00Z","image_small":"","location_name_no":"Norwegian Cyber Range","location_name_en":"","category_color":"#2da62b","category_name_no":"CTF"},{"id":370,"name_no":"Tekkom samling","name_en":"Tekkom gathering","highlight":false,"canceled":false,"full":false,"time_type":"default","time_start":"2025-04-22T18:00:00+02:00","time_end":"2025-04-22T22:00:00+02:00","time_publish":"2025-03-11T21:18:00+01:00","image_small":"","location_name_no":"Login Lounge (A155)","location_name_en":"","category_color":"#a206c9","category_name_no":"TekKom"},{"id":379,"name_no":"S2G CTF","name_en":"","highlight":false,"canceled":false,"full":false,"time_type":"default","time_start":"2025-04-23T16:00:00+02:00","time_end":"2025-04-23T21:00:00+02:00","time_publish":"0001-01-01T00:00:00Z","image_small":"","location_name_no":"Norwegian Cyber Range","location_name_en":"","category_color":"#2da62b","category_name_no":"CTF"}]
    const visible = ['id', 'name_no', 'name_en', 'category', 'location', 'time_type', 'start_time', 'end_time', 'publish_time', 'capacity', 'full', 'canceled', 'updated_at']
    return (
        <div className="w-full">
            <h1 className="font-semibold text-lg">Events</h1>
            <div className="flex justify-between">
                <h1>Filter (for text only)</h1>
                <h1>Create new button</h1>
            </div>
            <List sticky={['id']} list={list} visible={visible} />
        </div>
    )
}
