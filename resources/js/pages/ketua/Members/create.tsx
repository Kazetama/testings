import { Head, useForm } from '@inertiajs/react';
import MemberForm, { MemberFormData } from '@/components/MemberForm'; // Import MemberFormData
import AppLayout from '@/layouts/app-layout';
import React from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<MemberFormData>({
        full_name: '',
        nim: '',
        phone: '',
        batch: new Date().getFullYear(),
        position: '',
        status: 'trial',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/ketua/members');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Tambah Member', href: '/ketua/members/create' }]}>
            <Head title="Tambah Member" />
            <div className="max-w-4xl mx-auto p-6">
                <MemberForm
                    title="Registrasi Member Baru"
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                />
            </div>
        </AppLayout>
    );
}
