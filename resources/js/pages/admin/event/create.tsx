import { Head } from '@inertiajs/react'
import EventForm from '@/components/event-form'
import AppLayout from '@/layouts/app-layout'

export default function Create() {
    return (
        <AppLayout>
            <Head title="Create Event" />

            <div className="p-6">
                <EventForm
                    url="/admin/event"
                    method="post"
                />
            </div>
        </AppLayout>
    )
}
