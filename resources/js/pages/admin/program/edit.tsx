import { Head } from '@inertiajs/react'
import ProgramForm from '@/components/program-form'
import AppLayout from '@/layouts/app-layout'
import type { Program } from '@/types/program'

interface Props {
    program: Program
}

export default function Edit({ program }: Props) {
    return (
        <AppLayout>
            <Head title={`Edit Program - ${program.name}`} />
            <div className="p-6">
                <ProgramForm
                    program={program}
                    url={`/admin/program/${program.id}`}
                    method="put"
                />
            </div>
        </AppLayout>
    )
}
