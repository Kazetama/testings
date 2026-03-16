import { Head, Link } from '@inertiajs/react'
import { Calendar, ArrowRight, Search, Inbox } from 'lucide-react'
import { useState } from 'react'

// Import Shadcn UI Components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { Event, PaginatedData } from '@/types'

interface Props {
    events: PaginatedData<Event>
}

export default function Index({ events }: Props) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredEvents = events.data.filter((e) => 
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-6 lg:px-12">
            <Head title="Browse Events" />

            <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                        Daftar Event & Program
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-gray-600">
                        Temukan berbagai event menarik dan daftarkan dirimu segera secara online.
                    </p>
                </div>

                <div className="flex justify-center">
                    <div className="relative w-full max-w-lg">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Cari event yang kamu inginkan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-14 rounded-full border-gray-200 bg-white shadow-lg focus:ring-2 focus:ring-gray-900 transition-all"
                        />
                    </div>
                </div>

                {filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map((event) => (
                            <Card key={event.id} className="group overflow-hidden border-none shadow-md hover:shadow-2xl transition-all duration-300 rounded-3xl bg-white">
                                <div className="aspect-video overflow-hidden relative">
                                    <img 
                                        src={`/storage/${event.image}`} 
                                        alt={event.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <div className={`bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold shadow-sm border border-white/50 ${
                                            event.status === 'open' ? 'text-green-600' : 
                                            event.status === 'coming_soon' ? 'text-indigo-600' : 'text-red-600'
                                        }`}>
                                            {event.status === 'open' ? 'REGISTRATION OPEN' : 
                                             event.status === 'coming_soon' ? 'COMING SOON' : 'CLOSED'}
                                        </div>
                                    </div>
                                </div>
                                <CardHeader className="p-6">
                                    <CardTitle className="text-xl font-bold line-clamp-1 text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {event.name}
                                    </CardTitle>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>Diterbitkan: {new Date(event.created_at).toLocaleDateString('id-ID')}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-6 pb-4">
                                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                                        {event.description}
                                    </p>
                                </CardContent>
                                <CardFooter className="px-6 pb-8">
                                    <Button asChild className="w-full bg-gray-900 hover:bg-black text-white py-6 rounded-2xl font-bold transition-all active:scale-95 group">
                                        <Link href={`/event/${event.slug}`}>
                                            Detail & Daftar
                                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] shadow-sm border border-gray-100">
                        <div className="p-6 bg-gray-50 rounded-full mb-6">
                            <Inbox className="w-12 h-12 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Wah, belum ada event nih...</h3>
                        <p className="text-gray-500 mt-2">Coba cari dengan kata kunci lain atau cek lagi nanti ya!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
