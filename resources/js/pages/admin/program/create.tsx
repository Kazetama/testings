import { Head } from '@inertiajs/react'
import ProgramForm from '@/components/program-form'
import AppLayout from '@/layouts/app-layout'

export default function Create() {
    return (
        <AppLayout>
            <Head title="Create Program" />

            <div className="p-6">
                <ProgramForm
                    url="/admin/program"
                    method="post"
                />
            </div>
        </AppLayout>
    )
}
