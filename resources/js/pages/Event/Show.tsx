import { Head, useForm, Link } from '@inertiajs/react'
import { ArrowLeft, Send, CheckCircle, Info, ChevronRight, Share2, Calendar, FileText } from 'lucide-react'
import { useState } from 'react'

// Import Shadcn UI Components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import type { Event, RegistrationField } from '@/types/event'

interface Props {
    event: Event
}

export default function Show({ event }: Props) {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm<Record<string, any>>({})

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post(`/event/${event.slug}/register`, {
            onSuccess: () => reset(),
            preserveScroll: true
        })
    }

    const renderField = (field: RegistrationField) => {
        const fieldId = field.name.replace(/\s+/g, '-').toLowerCase()
        const fieldName = field.name.replace(/\s+/g, '_').toLowerCase()

        return (
            <div key={field.name} className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label htmlFor={fieldId} className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        {field.name}
                        {field.required && <span className="text-red-500 text-xs font-bold font-mono">*</span>}
                    </Label>
                </div>

                {field.type === 'text' && (
                    <Input
                        id={fieldId}
                        type="text"
                        placeholder={`Masukkan ${field.name.toLowerCase()}...`}
                        value={data[fieldName] || ''}
                        onChange={(e) => setData(fieldName, e.target.value)}
                        className={`h-12 rounded-xl bg-gray-50 border-gray-100 ${errors[fieldName] ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-600'}`}
                    />
                )}

                {field.type === 'number' && (
                    <Input
                        id={fieldId}
                        type="number"
                        placeholder="0"
                        value={data[fieldName] || ''}
                        onChange={(e) => setData(fieldName, e.target.value)}
                        className={`h-12 rounded-xl bg-gray-50 border-gray-100 ${errors[fieldName] ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-600'}`}
                    />
                )}

                {field.type === 'email' && (
                    <Input
                        id={fieldId}
                        type="email"
                        placeholder="contoh@email.com"
                        value={data[fieldName] || ''}
                        onChange={(e) => setData(fieldName, e.target.value)}
                        className={`h-12 rounded-xl bg-gray-50 border-gray-100 ${errors[fieldName] ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-600'}`}
                    />
                )}

                {field.type === 'textarea' && (
                    <Textarea
                        id={fieldId}
                        rows={4}
                        placeholder={`Tuliskan ${field.name.toLowerCase()}...`}
                        value={data[fieldName] || ''}
                        onChange={(e) => setData(fieldName, e.target.value)}
                        className={`rounded-xl bg-gray-50 border-gray-100 ${errors[fieldName] ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-600'} resize-none`}
                    />
                )}

                {field.type === 'select' && field.options && (
                    <Select onValueChange={(val) => setData(fieldName, val)}>
                        <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-gray-100">
                            <SelectValue placeholder="-- Pilih Opsi --" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                            {field.options.split(',').map((opt) => (
                                <SelectItem key={opt.trim()} value={opt.trim()} className="py-3 cursor-pointer">
                                    {opt.trim()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {field.type === 'radio' && field.options && (
                    <RadioGroup onValueChange={(val) => setData(fieldName, val)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {field.options.split(',').map((opt) => (
                            <div key={opt.trim()} className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                                <RadioGroupItem value={opt.trim()} id={`${fieldId}-${opt.trim()}`} />
                                <Label htmlFor={`${fieldId}-${opt.trim()}`} className="cursor-pointer flex-1 text-sm font-medium">{opt.trim()}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                )}

                {field.type === 'checkbox' && (
                    <div className="flex items-center space-x-3 p-4 rounded-xl bg-blue-50/30 border border-blue-100">
                        <Checkbox 
                            id={fieldId} 
                            checked={data[fieldName] || false}
                            onCheckedChange={(val) => setData(fieldName, val)}
                        />
                        <Label htmlFor={fieldId} className="text-sm font-medium leading-none cursor-pointer">
                            {field.name}
                        </Label>
                    </div>
                )}

                {errors[fieldName] && (
                    <p className="text-[10px] sm:text-xs font-bold text-red-500 uppercase tracking-widest mt-1">
                        {errors[fieldName]}
                    </p>
                )}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <Head title={event.name} />
            
            {/* Header Banner */}
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                <img 
                    src={`/storage/${event.image}`} 
                    className="absolute inset-0 w-full h-full object-cover brightness-[0.7] transform scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center pt-20 px-6">
                    <div className="text-center max-w-4xl space-y-6">
                        <Link href="/event" className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-bold border border-white/30 hover:bg-white/30 transition-all mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Daftar
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
                            {event.name}
                        </h1>
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(event.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Event Pendaftaran
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Side: Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white p-8 md:p-12">
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                        <Info className="w-8 h-8 text-blue-600" />
                                        Tentang Event
                                    </h2>
                                    <div className="h-1.5 w-24 bg-blue-600 rounded-full" />
                                </div>
                                <div className="prose prose-blue max-w-none prose-lg">
                                    <p className="text-gray-600 leading-loose text-lg whitespace-pre-line">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <div className="rounded-[2.5rem] bg-gray-900 p-12 text-white overflow-hidden relative group">
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10 space-y-6">
                                <h3 className="text-3xl font-black tracking-tight">Punya Pertanyaan?</h3>
                                <p className="text-gray-400 text-lg max-w-lg">
                                    Hubungi admin jika kamu butuh bantuan atau informasi tambahan mengenai event ini.
                                </p>
                                <Button size="lg" className="rounded-2xl bg-white text-gray-900 font-bold hover:bg-gray-100">
                                    Hubungi Admin
                                    <ChevronRight className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Registration Form */}
                    <div className="lg:col-span-1">
                        <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white sticky top-12 overflow-hidden">
                            <div className="h-3 bg-gradient-to-r from-blue-600 to-indigo-600" />
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-2xl font-black text-gray-900 mb-2">Pendaftaran Online</CardTitle>
                                <CardDescription className="font-medium text-gray-500">
                                    {event.status === 'open' 
                                        ? 'Pendaftaran dibuka untuk publik. Isi data di bawah ini.' 
                                        : 'Mohon maaf, pendaftaran telah ditutup.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-4">
                                {recentlySuccessful ? (
                                    <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center animate-in zoom-in-50 duration-500">
                                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-12 h-12 text-green-600" />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-2xl font-black text-gray-900">Pendaftaran Berhasil!</h4>
                                            <p className="text-gray-500 font-medium">Data pendaftaran kamu telah kami terima.</p>
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            onClick={() => window.location.reload()}
                                            className="rounded-xl border-gray-200 font-bold"
                                        >
                                            Daftar Lagi?
                                        </Button>
                                    </div>
                                ) : event.status === 'open' ? (
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {event.registration_fields?.map((field) => renderField(field))}
                                        
                                        <Button 
                                            type="submit" 
                                            disabled={processing}
                                            className="w-full bg-blue-600 hover:bg-blue-700 py-8 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
                                        >
                                            {processing ? 'Memproses...' : (
                                                <>
                                                    Kirim Pendaftaran
                                                    <Send className="ml-2 w-5 h-5" />
                                                </>
                                            )}
                                        </Button>
                                        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-loose">
                                            Dengan menekan tombol di atas, kamu setuju dengan syarat & ketentuan yang berlaku.
                                        </p>
                                    </form>
                                ) : (
                                    <div className="text-center py-12 space-y-4">
                                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                            <Info className="w-10 h-10 text-red-600" />
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900">Registrasi Ditutup</h4>
                                        <p className="text-gray-500 text-sm">Cek event menarik lainnya di website kami!</p>
                                        <Button asChild variant="link" className="text-blue-600">
                                            <Link href="/event">Lihat Event Lainnya</Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        
                        <div className="mt-8 flex justify-center gap-6">
                            <button className="p-3 bg-gray-100 rounded-2xl text-gray-600 hover:bg-white hover:shadow-lg transition-all active:scale-90">
                                <Share2 className="w-5 h-5" />
                            </button>
                            <p className="text-sm font-bold text-gray-400 flex items-center uppercase tracking-widest">Bagikan Event</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
