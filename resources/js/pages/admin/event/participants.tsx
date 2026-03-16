import { Head, Link } from '@inertiajs/react'
import { ArrowLeft, Download, User, Calendar, FileSpreadsheet, Search, Inbox } from 'lucide-react'
import { useState } from 'react'

// Import Shadcn UI Components
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import AppLayout from '@/layouts/app-layout'
import type { Event } from '@/types/event'

interface Participant {
    id: number
    registration_data: Record<string, any>
    created_at: string
}

interface PaginatedParticipants {
    data: Participant[]
    links: any[]
}

interface Props {
    event: Event
    participants: PaginatedParticipants
}

export default function Participants({ event, participants }: Props) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredParticipants = participants.data.filter((p) => {
        const fullDataString = JSON.stringify(p.registration_data).toLowerCase()
        return fullDataString.includes(searchTerm.toLowerCase())
    })

    const handleExport = () => {
        window.open(`/admin/event/${event.id}/export`, '_blank')
    }

    return (
        <AppLayout>
            <Head title={`Pendaftar - ${event.name}`} />

            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                            <Link href="/admin/event">
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                Daftar Pendaftar
                            </h1>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5" />
                                {event.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Cari data pendaftar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 bg-white shadow-sm border-gray-200"
                            />
                        </div>
                        <Button 
                            onClick={handleExport}
                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold shadow-md transition-all active:scale-95"
                        >
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Ekspor Excel
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-1 shadow-sm border-gray-200 rounded-xl overflow-hidden">
                        <CardHeader className="bg-gray-50/40 border-b">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-500">Ringkasan Event</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="aspect-video rounded-lg border overflow-hidden bg-gray-50">
                                <img src={`/storage/${event.image}`} className="w-full h-full object-cover" />
                            </div>
                            <div className="space-y-4 pt-2">
                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span className="text-sm text-gray-500">Status</span>
                                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${event.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {event.status === 'open' ? 'DIBUKA' : 'DITUTUP'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span className="text-sm text-gray-500">Total Pendaftar</span>
                                    <span className="text-lg font-bold text-gray-900">{participants.data.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Dibuat Pada</span>
                                    <span className="text-sm font-medium text-gray-700">{new Date(event.created_at).toLocaleDateString('id-ID')}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="md:col-span-2">
                        <Card className="shadow-sm border-gray-200 rounded-xl overflow-hidden bg-white">
                            <Table>
                                <TableHeader className="bg-gray-50/80">
                                    <TableRow>
                                        <TableHead className="w-12 pl-6">#</TableHead>
                                        <TableHead className="font-bold text-gray-700">Data Pendaftaran</TableHead>
                                        <TableHead className="font-bold text-gray-700 text-right pr-6">Waktu Daftar</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredParticipants.length > 0 ? (
                                        filteredParticipants.map((participant, index) => (
                                            <TableRow key={participant.id} className="hover:bg-gray-50 transition-colors border-b last:border-0 group">
                                                <TableCell className="pl-6 font-medium text-gray-400 group-hover:text-gray-900">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                                                        {Object.entries(participant.registration_data).map(([key, value]) => (
                                                            <div key={key} className="flex flex-col">
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                                                                    {key.replace(/_/g, ' ')}
                                                                </span>
                                                                <span className="text-sm font-semibold text-gray-700">
                                                                    {String(value)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right text-xs text-gray-400 pr-6 align-top pt-5">
                                                    {new Date(participant.created_at).toLocaleString('id-ID')}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-64 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-3">
                                                    <div className="p-3 bg-gray-50 rounded-full">
                                                        <Inbox className="w-8 h-8 text-gray-300" />
                                                    </div>
                                                    <p className="text-gray-400 font-medium">Belum ada pendaftar untuk event ini.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
