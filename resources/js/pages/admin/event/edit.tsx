import { Head } from '@inertiajs/react'
import EventForm from '@/components/event-form'
import AppLayout from '@/layouts/app-layout'
import type { Event } from '@/types/event'

interface Props {
    event: Event
}

export default function Edit({ event }: Props) {
    return (
        <AppLayout>
            <Head title={`Edit Event - ${event.name}`} />
            <div className="p-6">
                <EventForm
                    event={event}
                    url={`/admin/event/${event.id}`}
                    method="put"
                />
            </div>
        </AppLayout>
    )
}
